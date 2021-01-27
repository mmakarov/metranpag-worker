const pkg = require('getmac').default
serverAt = "http://192.168.0.76:555";

wrkid = `worker-${new Date().getMilliseconds()}@${pkg()}`
console.info(`[${wrkid}] запуск`);
// doing =  {
//     name: "No Tasks in Queue",
//     WIP: false,
//     worker: "unassigned",
//     id: "1",
//   };

doing = {
  name: "Нет задач",
  WIP: false,
  worker: wrkid,
  id: -1,
  done: false,
};

const
  io = require("socket.io-client"),
  ioClient = io.connect(serverAt);

//ioClient.on("connected", (msg) => console.info("pong"));

ioClient.on('connect', () => {

  // either with send()
  ioClient.send(`[${wrkid}] Установлено соединение с сервером ${serverAt}`);

  // or with emit() and custom event names
  ioClient.emit('stat', 'Информация о виртуальной среде выполнения задач', { 'id': wrkid }, doing);
});

let counter = 0;
setInterval(() => {
  ++counter;
  if (!doing.WIP) {
    ioClient.emit('avail', 'Свободен (нет выполняемых задач)', { 'sender': wrkid }, doing);
  } else {
    ioClient.emit('busy', doing.name, { 'sender': wrkid }, doing);
  }
}, 5000);

// handle the event sent with socket.send()
ioClient.on('message', data => {
  console.log(`[${wrkid}] Получено сообщение: ${data}`);
});

// handle the event sent with socket.emit()
ioClient.on('stat', (elem1, elem2, elem3) => {
  console.log(`[${wrkid}] Получено событие 'stat':`);
  console.log(elem1, elem2, elem3);
});

ioClient.on('do', (msg, task) => {
  console.log(`[${wrkid}] Получено задание:`);
  console.log(msg, task);
  doing = task;
  console.log(`[${wrkid}] Обработка задания: `);
  console.log(doing);

  doing.done = true;
  ioClient.emit('done', doing.name, { 'sender': wrkid });

  switch (doing.name.toLowerCase()) {
    case "открыть indesign":
      var exec = require('child_process').exec;
      exec('"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"', function (err, stdout, stderr) {
        if (err) {
          throw err;
        }
      })
      doing = {
        name: "Пустая очередь задач",
        WIP: false,
        worker: wrkid,
        id: -1,
        done: false,
      };
      console.log(`[${wrkid}] Done: `);
      console.log(doing);
      break;

    case "открыть калькулятор":
      var exec = require('child_process').exec;
      exec('"calc.exe"', function (err, stdout, stderr) {
        if (err) {
          throw err;
        }
      })
      doing = {
        name: "Пустая очередь задач",
        WIP: false,
        worker: wrkid,
        id: -1,
        done: false,
      };
      console.log(`[${wrkid}] Задание выполнено: `);
      console.log(doing);
      break;

    case "powershell":
      const Shell = require('node-powershell');


      const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true
      });

      ps.addCommand("$ind = new-object -comobject "
        + inDesignVersion + ";"
                             "$myArray = @('" +
        documentFilename + "', '" +
        projectDestination + "', '" +
        pathToImportWord + "', '" +
        pathToDoText + "', '" +
        pathToDoQuotes + "', '" +
        pathToDoYo + "'" + launchWinParams + ");"
                             "$ind.DoScript('" + pathWinImportWord + "', 1246973031, $myArray);\"');
      ps.invoke()
          .then(output => {
            doing = {
              name: "Пустая очередь задач",
              WIP: false,
              worker: wrkid,
              id: -1,
              done: false,
            };
            console.log(`[${wrkid}] Задание выполнено: `);
            console.log(output);
          })
          .catch(err => {
            doing = {
              name: "Last job resulted in error",
              WIP: false,
              worker: wrkid,
              id: -1,
              done: false,
            };
            console.log(`[${wrkid}] Error: `);
            console.log(err);
          });

      break;

    default:
      doing = {
        name: "Нет задач",
        WIP: false,
        worker: wrkid,
        id: -1,
        done: false,
      };
      console.log(`[${wrkid}] Задание выполнено: `);
      console.log(doing);
      break;
  }

})