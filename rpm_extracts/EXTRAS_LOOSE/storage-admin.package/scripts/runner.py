# File: runner.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/runner.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
 Daemon runner library.
    
absolute_import
unicode_literalsN
pidfile)
0_chain_exception_from_existing_exception_context
DaemonContext
basestring
unicodeu@
The 
runner
 module is not a supported API for this library.c
DaemonRunnerErrorz3 Abstract base class for errors from DaemonRunner. c
_chain_from_context
super
__init__)
self
args
kwargs
	__class__
	runner.pyr
DaemonRunnerError.__init__c
as_cause
z%DaemonRunnerError._chain_from_context)
__name__
__module__
__qualname__
__doc__r
__classcell__r
DaemonRunnerInvalidActionErrorz; Raised when specified action for DaemonRunner is invalid. c
z2DaemonRunnerInvalidActionError._chain_from_contextN)
DaemonRunnerStartFailureErrorz, Raised when failure starting DaemonRunner. N
DaemonRunnerStopFailureErrorz, Raised when failure stopping DaemonRunner. Nr
DaemonRunnera4
 Controller for a callable running in a separate background process.
        The first command-line argument is the action to take:
        * 'start': Become a daemon and call `app.run()`.
        * 'stop': Exit the daemon process specified in the PID file.
        * 'restart': Stop, then start.
        z
started with pid {pid:d}c
 Set up the parameters of a new runner.
            :param app: The application instance; see below.
            :return: ``None``.
            The `app` argument must have the following attributes:
            * `stdin_path`, `stdout_path`, `stderr_path`: Filesystem paths
              to open and replace the existing `sys.stdin`, `sys.stdout`,
              `sys.stderr`.
            * `pidfile_path`: Absolute filesystem path to a file that will
              be used as the PID file for the daemon. If ``None``, no PID
              file will be used.
            * `pidfile_timeout`: Used as the default acquisition timeout
              value supplied to the runner's PID lock file.
            * `run`: Callable that will be invoked when the daemon is
              started.
            N)	
parse_args
appr
daemon_context
#_open_streams_from_app_stream_pathsr
pidfile_path
make_pidlockfileZ
pidfile_timeout
DaemonRunner.__init__c
 Open the `daemon_context` streams from the paths specified.
            :param app: The application instance.
            Open the `daemon_context` standard streams (`stdin`,
            `stdout`, `stderr`) as stream objects of the appropriate
            types, from each of the corresponding filesystem paths
            from the `app`.
            Z
w+tN)
openZ
stdin_pathr$
stdinZ
stdout_path
stdoutZ
stderr_path
stderrr'
z0DaemonRunner._open_streams_from_app_stream_pathsc
 Emit a usage message, then exit.
            :param argv: The command-line arguments used to invoke the
                program, as a sequence of strings.
            :return: ``None``.
            r
usage: {progname} {usage})
progname
usageN)
path
basename
join
action_funcs
keys
format
emit_message
exit)
argvr.
usage_exit_code
action_usage
messager
_usage_exit
DaemonRunner._usage_exitNc
 Parse command-line arguments.
            :param argv: The command-line arguments used to invoke the
                program, as a sequence of strings.
            :return: ``None``.
            The parser expects the first argument as the program name, the
            second argument as the action to perform.
            If the parser fails to parse the arguments, emit a usage
            message and exit the program.
            Nr,
lenr=
actionr4
min_argsr
DaemonRunner.parse_argsc
 Open the daemon context and run the application.
            :return: ``None``.
            :raises DaemonRunnerStartFailureError: If the PID file cannot
                be locked by this process.
            z(PID file {pidfile.path!r} already lockedr
pidN)
is_pidfile_staler
break_lockr$
lockfileZ
AlreadyLockedr
getpid
start_messager7
run)
errorrA
_start
DaemonRunner._startc
 Terminate the daemon process specified in the current PID file.
            :return: ``None``.
            :raises DaemonRunnerStopFailureError: If terminating the daemon
                fails with an OS error.
            z"Failed to terminate {pid:d}: {exc})
excN)	r
read_pidr0
kill
signal
SIGTERM
OSErrorr 
_terminate_daemon_process
z&DaemonRunner._terminate_daemon_processc
 Exit the daemon process specified in the current PID file.
            :return: ``None``.
            :raises DaemonRunnerStopFailureError: If the PID file is not
                already locked.
            z$PID file {pidfile.path!r} not lockedr
Z	is_lockedr 
_stop
DaemonRunner._stopc
 Stop, then start.
            N)
_restart
DaemonRunner._restart)
start
stopZ
restartc
 Get the function for the specified action.
            :return: The function object corresponding to the specified
                action.
            :raises DaemonRunnerInvalidActionError: if the action is
               unknown.
            The action is specified by the `action` attribute, which is set
            during `parse_args`.
            z
Unknown action: {action!r})
KeyErrorr
funcrH
_get_action_func
DaemonRunner._get_action_funcc
 Perform the requested action.
            :return: ``None``.
            The action is specified by the `action` attribute, which is set
            during `parse_args`.
            N)
	do_action
DaemonRunner.do_action)
z@ Emit a message to the specified stream (default `sys.stderr`). Nz
{message}
writer6
flush)
streamr
z= Make a PIDLockFile instance with the given filesystem path. z
Not a filesystem path: {path!r})
Not an absolute path: {path!r})	
isinstancer
ValueErrorr6
isabsr
TimeoutPIDLockFile)
acquire_timeoutrH
 Determine whether a PID file is stale.
        :return: ``True`` iff the PID file is stale; otherwise ``False``.
        The PID file is 
stale
 if its contents are valid but do not
        match the PID of a currently-running process.
        FNT)	rK
SIG_DFL
ProcessLookupErrorrO
errnoZ
ESRCH)
resultZ
pidfile_pidrJ
N)#r
__future__r
warningsrD
daemonr
daemon.daemonr
	NameError
NotImplemented
typeZ
__metaclass__
warn
DeprecationWarning
	Exceptionr
RuntimeErrorr
<module>
