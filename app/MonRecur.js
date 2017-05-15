const status = {
  "RUNING": "RUNING",
  "PENDING": "PENDING",
  "CLOSE": "CLOSE",
  "ERROR":"ERROR"
};
let runTask = {};
class MonRecur {
  constructor(_runTask) {
    this.init();
    runTask = _runTask;
  }
  init() {
    this.status = status.PENDING;
  }
  taskRuning(data, deferTime) {
    return new Promise((r, j) => {
      if (Number.isNaN(deferTime) && Number.parseInt(deferTime) >= 0) {
        r(runTask.task.call(runTask, data, this));
      } else {
        setTimeout(() => {
          r(runTask.task.call(runTask, data, this));
        }, deferTime)
      }
    }).then(_data => {
        if (this.status === status.RUNING) {
          return this.taskRuning(runTask.watch.call(runTask, _data), deferTime);
        } else {
          this.close();
          return runTask.close.call(runTask, "close", _data, this);
        }
      }, err => {
        if (err === "close" || err.message === "close") {
          this.close();
          return runTask.close.call(runTask, err.message, err.data, this);
        } else {
          this.error();
          runTask.error.call(runTask, err, this);
        }
      });
  }
  start(data, deferTime) {
    if (this.status !== status.RUNING) {
      this.status = status.RUNING;
      return this.taskRuning(runTask.watch.call(runTask, data), deferTime)
    }else{
      return Promise.reject("任务启动中...");
    }
  }
  error(){
    this.status = status.ERROR;
    console.log("task is error");
  }
  close() {
    this.status = status.PENDING;
    console.log("task is close");
  }
  getStatus() {
    console.log("status = " + this.status);
    return this.status;
  }
  static createTask(agrn) {
    if(!agrn.watch){
      agrn.watch = watch;
    }
    if(!agrn.close){
      agrn.close = close;
    }
    if(!agrn.error){
      agrn.error = error;
    }
    let task = new MonRecur(agrn);
    return task;
  }
}
function watch(agrn) {
  console.log("agrn = " + agrn);
  console.log("data = " + this.data);
  return agrn;
}
function close() {

}
function error() {
    console.log(err);
}
module.exports = MonRecur;
