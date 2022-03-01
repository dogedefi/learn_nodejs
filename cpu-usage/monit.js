const cluster = require("cluster");
const pidusage = require("pidusage");

module.exports = (callback) => {
  if (cluster.isMaster) {
    // function getProcessPercent(pid) {
    //   // linux command to get cpu percentage for the specific Process Id.
    //   var cmd = `ps up "${pid}" | tail -n1 | tr -s ' ' | cut -f3 -d' '`;

    //   // executes the command and returns the percentage value
    //   exec(cmd, function (err, percentValue) {
    //     if (err) {
    //       console.log("Command `ps` returned an error!");
    //     } else {
    //       console.log(`${percentValue * 1}%`);
    //     }
    //   });
    // }

    function getProcessPercent(pid) {
      return setInterval(() => {
        pidusage(pid, function (err, stats) {
          console.log(stats);
          // => {
          //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
          //   memory: 357306368,    // bytes
          //   ppid: 312,            // PPID
          //   pid: 727,             // PID
          //   ctime: 867000,        // ms user + system time
          //   elapsed: 6650000,     // ms since the start of the process
          //   timestamp: 864000000  // ms since epoch
          // }
        });
      }, 1000);
    }

    const worker = cluster.fork();
    const intervalid = getProcessPercent(worker.process.pid);

    worker.on("exit", () => {
      clearInterval(intervalid);
    });
  } else {
    callback();
  }
};
