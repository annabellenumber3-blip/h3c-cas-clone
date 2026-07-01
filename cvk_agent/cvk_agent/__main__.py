"""
CVK Agent — main entry point.

Run as:
    python -m cvk_agent [--config /etc/cvk/cvk_agent.conf] [--mock]

The CVK agent daemon runs on each CVK (Cloud Virtual Kernel) hypervisor host
and communicates with the CVM management server via REST/XML over HTTP Digest
auth.

Usage:
    python -m cvk_agent                    # Start the agent
    python -m cvk_agent --mock             # Run in mock mode (for testing)
    python -m cvk_agent --status            # Print status and exit
    python -m cvk_agent --config /path/to/cvk_agent.conf  # Custom config path
"""

import argparse
import logging
import sys

from cvk_agent.config import CvkConfig
from cvk_agent.agent import CvkAgent


def setup_logging(verbose: bool = False) -> None:
    """Configure logging for the CVK agent.

    By default, the Java agent logs to /var/log/cvk/cvkagent.log.
    We log to stderr (systemd captures this) with timestamps.
    """
    level = logging.DEBUG if verbose else logging.INFO
    fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    logging.basicConfig(
        level=level,
        format=fmt,
        stream=sys.stderr,
    )


def main():
    parser = argparse.ArgumentParser(
        description="H3C CVK Agent — KVM hypervisor management agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python -m cvk_agent                    # Start the agent
  python -m cvk_agent --mock             # Run in mock mode (for testing)
  python -m cvk_agent --status            # Print status and exit
  python -m cvk_agent --config /etc/cvk/cvk_agent.conf  # Custom config
        """,
    )
    parser.add_argument(
        "--config", "-c",
        default="/etc/cvk/cvk_agent.conf",
        help="Path to cvk_agent.conf (default: /etc/cvk/cvk_agent.conf)",
    )
    parser.add_argument(
        "--mock", "-m",
        action="store_true",
        help="Run in mock mode (no hardware/KVM/OVS required)",
    )
    parser.add_argument(
        "--status", "-s",
        action="store_true",
        help="Print agent status and exit",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose (debug) logging",
    )

    args = parser.parse_args()
    setup_logging(args.verbose)
    log = logging.getLogger("cvk_agent")

    log.info("CVK Agent v1.0.0 — Python clone of cvk-agent-api.jar")
    log.info("Configuration: %s", args.config)

    # Load configuration
    try:
        config = CvkConfig.from_file(args.config)
    except Exception as exc:
        log.error("Failed to load configuration: %s", exc)
        sys.exit(1)

    # Create and initialize the agent
    agent = CvkAgent(config=config)

    if not agent.initialize(mock_mode=args.mock):
        log.error("Agent initialization failed")
        sys.exit(1)

    if args.status:
        # Print status and exit
        import json
        status = agent.get_status()
        print(json.dumps(status, indent=2, default=str))
        agent.shutdown()
        return

    # Start the agent (runs until SIGTERM/SIGINT)
    try:
        agent.start()
    except KeyboardInterrupt:
        log.info("Interrupted by user")
    except Exception as exc:
        log.error("Agent error: %s", exc)
        sys.exit(1)
    finally:
        agent.shutdown()


if __name__ == "__main__":
    main()
