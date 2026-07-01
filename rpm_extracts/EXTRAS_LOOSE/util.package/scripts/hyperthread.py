# File: hyperthread.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/hyperthread.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

e!d	
Z$e$
e!d	
e!d	
Z'e'
Z)e)d
e)d	
e!d	
Z*e*
Z+e)d
nve)d
e+d k
nTe)d
n2e)d
r8e+d k
r8e e
e!d	
e!d	
d#d$d%
Z-zZe
j"e-d
Z'e'
Z)e)d
e)d	
ProcessExecutionErrorNc
superr
__init__
	exit_code
stderr
stdout
description)
selfr
	__class__
hyperthread.pyr
ProcessExecutionError.__init__c
Nz!Unexpected error while running %s
-z&%s
Exit code: %s
Stdout: %r
Stderr: %r)
messager
__str__)
ProcessExecutionError.__str__)
NNNNN)
__name__
__module__
__qualname__r
__classcell__r
d&d'
Helper method to shell out and execute a command through subprocess.
    :param cmd:             Passed to subprocess.Popen.
    :type cmd:              string
    :param process_input:   Send to opened process.
    :type process_input:    string
    :param shell:           whether or not there should be a shell used to
                            execute this command. Defaults to false.
    :type shell:            boolean
    :param check_exit_code: Single bool, int, or list of allowed exit
                            codes.  Defaults to [0].  Raise
                            :class:`ProcessExecutionError` unless
                            program exits with one of these code.
    :type check_exit_code:  boolean, int, or [int]
    :param attempts:        How many times to retry cmd.
    :type attempts:         int
    :param delay_on_retry:  True | False. Defaults to True. If set to True,
                            wait a short amount of time before retrying.
    :type delay_on_retry:   boolean
    :param interval:        The multiplier defined in seconds. it is valid
                            with backoff_rate parameter to controll exponential
                            backoff retries
    :type interval:         int
    :param backoff_rate:    Used for the exponential backoff retries replaces
                            random sleep times. Disabled if delay_on_retry is
                            passed as a parameter.
    :type backoff_rate:     int
    :param timeout:         Timeout defined in seconds. To use the timeout
                            mechanism to stop the subprocess with a specific
                            signal
    :type timeout:          int
    :param signal:          Signal to use to stop the process on timeout
    :param raise_timeout:   Raise an exception on timeout. Defaults to raise
    :type raise_timeout:            boolean
    :returns:               Tuple with stdout and stderr
    )
zdTimeout mechanism is controlled with timeout, signal,
        and raise_timeout parameters.
        z8Stopping %(cmd)s with signal %(signal)s after %(time)ss.)
signalr
timer
LOGZ
warningZ
send_signal)
proc)
shared_data
sig_end
timeoutr
on_timeouti
execute_cmd.<locals>.on_timeoutc
Track process creation asynchronously.
        It will be called upon process creation with
        the Popen object as a argument.
        r
Sleeping for %s secondsr	
maxr#
debugr"
sleep
	threading
Timer
start)
wait_for)
backoff_rate
intervalr(
on_executes
execute_cmd.<locals>.on_executec
Track process completion asynchronously.
        It will be called upon process completion with the
        Popen object as a argument.
        r	
cancel)
unused_proc)
on_completion
z"execute_cmd.<locals>.on_completion
process_inputNz
utf-8
shellF
check_exit_coder
attemptsr	
raise_timeoutT
delay_on_retryr1
str)
<listcomp>
execute_cmd.<locals>.<listcomp>)
stdinr
zS%(desc)r
command: %(cmd)r
exit code: %(code)r
stdout: %(stdout)r
stderr: %(stderr)r)
descr
coder
zKTimeout on proc %(pid)s after waiting %(time)s seconds when running %(cmd)s)
pidr"
z0Got an OSError
command: %(cmd)r
errno: %(errno)r)
errnoz
%r failed. Not Retrying.z
%r failed. Retrying.
encoder!
SIGTERM
isinstance
bool
list
subprocess
Popen
PIPEZ
communicater@
close
returncoder
OSErrorr#
errorrD
randomZ
randint)
kwargsr2
ignore_exit_coder8
resultZ
return_coder
errZ
str_formatr$
msgr
execute_cmd=
z/ipmitool raw 0x36 0x0b 0xa2 0x63 0x00 0x1a 0x05z
lscpu | grep Threadz0ipmitool raw 0x36 0x0b 0xa2 0x63 0x00 0x19 0x05 z"dmidecode -t 2 | grep Manufacturer
__main__)
statusr.
H3Cr]
0x01Z
0x00)
osr"
logging
sysZ	getLoggerr
ERROR_PARAMETERZ
ERROR_NOT_SUPPORTZ
ERROR_RETURN_CODE_INVALIDZ
ERROR_FIND_EXEC_FAILEDZ
ERROR_SET_EXEC_FAILEDZ"ERROR_FIND_MANUFACTURE_EXEC_FAILEDZ
ERROR_NOT_H3CZ
DO_SECCESSZ
STATUS_CONFIG_ENABLE_STARTEDZ
STATUS_CONFIG_ENABLE_STOPEDZ
STATUS_CONFIG_DISABLE_STARTEDZ
STATUS_CONFIG_DISABLE_STOPEDZ
STATUS_ERROR
	Exceptionr
findcommand_ipmiZ
findcommandZ
setcommandZ
manu
argv
print
exitZ
check_output
decodeZ
manuresult
upperZ	manufinalrX
split
result2r^
keyZ
setcommand1r
<module>
