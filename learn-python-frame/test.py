import time
from sys import stderr

import ProfilerThread

if __name__ == "__main__": # test case
    fd = open('profiler.txt', 'wb')
    ProfilerThread.prof_file = fd
    assert(ProfilerThread.profiler_start())

    time.sleep(5.0)

    profiler_time, sample_count = ProfilerThread.profiler_stop()
    stderr.write('profile task time is %.3fs\n' % profiler_time)
    stderr.write('profile sample count is %d\n' % sample_count)
    fd.close()
