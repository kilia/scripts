import sys, time, threading

from sys import stdout, stderr

sys_interval = sys.getcheckinterval()
profile_interval = 8192

prof_file = stdout
log_file = stderr

''' after benchmark, Timer is inaccurate, cpu-consuming compared to thread+sleep
def timer_task():
    global period, shutdown
    global tt
    global ttcount
    if shutdown:
        return
    timer = threading.Timer(period, timer_task)
    timer.start()
    t0 = time.time()
    get_last_stack()
    tt += time.time() - t0
    ttcount += 1
'''

class ProfilerThread(threading.Thread):
    '''
        a sample based profiler implemented fully in python
    '''
    def __init__(self, is_full_stack = False, interval = 0.01, sample_duration = 30.0, thread_check_interval = 8192):
        threading.Thread.__init__(self)
        self.profiler_time = 0.0
        self.sample_count = 0
        self.interval = 0.01
        self.shutdown = False
        self.sample_duration = sample_duration
        self.thread_check_interval = thread_check_interval
        self.is_full_stack = is_full_stack
        self.setDaemon(True)
        self.frames = []

    ''' detailed info, if we need call stack '''
    def get_full_stack(self):
        for key, frame in sys._current_frames().items():
            call_stack = ['T[%d]' % key]
            while frame is not None:
                code = frame.f_code
                call_stack.append('%s:%d %s()' %(code.co_filename, frame.f_lineno, code.co_name))
                frame = frame.f_back
            self.frames.append(' | '.join(call_stack))

    ''' only last call in the stack '''
    def get_last_stack(self):
        for key, frame in sys._current_frames().items():
            code = frame.f_code
            self.frames.append('T[%d] %s:%d %s()' %(key, code.co_filename, frame.f_lineno, code.co_name))

    def run(self):
        timeout_time = time.time() + self.sample_duration
        old_interval = sys.getcheckinterval() # default 100 
        sys.setcheckinterval(self.thread_check_interval)
        stack_func = self.is_full_stack and self.get_last_stack or self.get_full_stack 

        while not self.shutdown:
            t0 = time.time()
            if t0 >= timeout_time:
                break
            stack_func()
            self.profiler_time += time.time() - t0
            self.sample_count += 1
            time.sleep(self.interval)
        # restore 
        sys.setcheckinterval(old_interval)
    
    def stop(self):
        self.shutdown = True

profiler_thread = None

def profiler_start():
    global profiler_thread
    if not profiler_thread is None:
        return False # start failed
    profiler_thread = ProfilerThread()
    profiler_thread.start()
    return True

def profiler_stop():
    global profiler_thread
    assert(not profiler_thread is None)
    profiler_thread.stop()
    profiler_thread.join()
    for f in profiler_thread.frames:
        prof_file.write(f + '\n')
    prof_file.flush()
    profiler_time = profiler_thread.profiler_time
    sample_count = profiler_thread.sample_count
    profiler_thread = None

    return (profiler_time, sample_count)

if __name__ == "__main__": # test case
    def sum100k():
        s = 0
        for i in xrange(100000):
            s += i
        return s

    def sum10k():
        s = 0
        for i in xrange(10000):
            s += i
        return s

    count = 0
    def dummy(n):
        global count
        while count < n:
            count += 1
            sum100k()
            sum10k()

    told = time.time()
    
    assert(profiler_start())
    dummy(3000)
    profiler_time, sample_count = profiler_stop()
    
    dt = time.time() - told

    time.sleep(0.0)

    stderr.write('exec time is %.3fs\n' % dt)
    stderr.write('exec count is %d\n' % count)
    stderr.write('profile task time is %.3fs\n' % profiler_time)
    stderr.write('profile sample count is %d\n' % sample_count)

    #print 'going to quit()'
    #quit()