import MonRecur from './MonRecur.js';


let task = MonRecur.createTask({
  data: 0,
  task(n) {
    // 在任务内部结束
    return new Promise((r, j) => {
      setTimeout(() => {
        if (n == 1) {
          return j({
            message: "close",
            data: this.data
          });
        } else {
          this.data = this.data === 0 ? n : this.data;
          this.data = this.data * (n - 1);
          r(n - 1);
        }
      }, 10000);
    })

  },
  close(status, agrn) {
    if (status === "close") {
      return this.data;
    }
  }
});

task.start(4)
  .then((data) => {
    console.log("结果 =" + data);
  });
