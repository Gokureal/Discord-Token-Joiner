const chalk = require("chalk");

process.on("unhandledRejection", (reason, promise) => {
  console.log(`${chalk.redBright("[HATA]")} Hata: ${promise} - Sebep: ${reason}`);
});

process.on("uncaughtException", (err, origin) => {
  console.log(`${chalk.redBright("[HATA]")} ${err} ( ${origin} )`);
});


const gradient = require('gradient-string');
const ayarlar = require('./src/ayarlar.json');
const { Client } = require("discord.js-selfbot-v13");
var totalJoined = 0;
var failed = 0;
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require("fs");


console.log(gradient.rainbow("Goku/olmaz#0 - Token Sokucu"));

async function readTokens() {
  const tokens = fs.readFileSync('ananinaminakoyim.txt').toString().split("\n");

  for (i in tokens) {
    await new Promise((resolve) => setTimeout(resolve, i * ayarlar.joinDelay));
    doEverything(
      tokens[i]?.trim()?.replace("\r", "")?.replace("\n", ""),
      tokens
    );
  }
}
readTokens();
const proxies = fs.readFileSync('coktaonemlidegil.txt').toString().split("\n");

async function doEverything(token, tokens) {
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]?.replace("\r", "")?.replace("\n", "");
  var client;
  if (ayarlar.useProxies) {


    var agent = HttpsProxyAgent(randomProxy);
    client = ayarlar.captcha_api_key
      ? new Client({
        captchaService: ayarlar.captcha_service.toLowerCase(),
        captchaKey: ayarlar.captcha_api_key,
        checkUpdate: false,
        http: { agent: agent },
        restRequestTimeout: 60 * 1000,
        interactionTimeout: 60 * 1000,
        restWsBridgeTimeout: 5 * 1000
      })
      : new Client({ checkUpdate: false });

  }

  else {
    client = ayarlar.captcha_api_key
      ? new Client({
        captchaService: ayarlar.captcha_service.toLowerCase(),
        captchaKey: ayarlar.captcha_api_key,
        checkUpdate: false,
      })
      : new Client({ checkUpdate: false });
  }
  
  client.on("ready", async () => {
    console.log(chalk.green("[TOKEN - AKTİF]") + gradient.cristal(client.user.tag));


    await client
      .fetchInvite(ayarlar.inviteCode)
      .then(async (invite) => {

        await invite
          .acceptInvite(true)
          .then(async () => {
            console.log(chalk.greenBright(`[TOKEN - SUNUCUYA SOKULDU] - ${gradient.passion(client.user.tag)}`));
            totalJoined++;
            process.title = `Başarılı: ${totalJoined} | Olmadı mk: ${failed}`;

            if (client.token === tokens[tokens.length - 1]) {
              console.log(`${chalk.magentaBright("[ananın amına koyim]")} Tokenler toplam ( ${gradient.passion(totalJoined)} ) sunucuya sokuldu, ( ${gradient.passion(failed)} ) sunucuda sokulamadı.}`)

              process.title = `sokuldu: ${totalJoined} | sokulamadı: ${failed}`;
            }
          })
          .catch((err) => {
            console.log(`${chalk.redBright("[HATA]")} ${gradient.fruit(client.user.tag)} Adlı token sunucuya sokulamadı.`);
            failed++;
            process.title = `sokuldu: ${totalJoined} | sokulamadı: ${failed}`;


            console.error(chalk.redBright(err));

            if (client.token === tokens[tokens.length - 1]) {
              console.log(`${chalk.magentaBright("[ananın amına koyim]")} Tokenler toplam ( ${gradient.passion(totalJoined)} ) sunucuya sokuldu, ( ${gradient.passion(failed)} ) sunucuya sokulamadı .}`)

              process.title = `sokuldu: ${totalJoined} | sokulamadı: ${failed}`;

            }
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });


  client.login(token).catch(() => {
    console.log(`${chalk.redBright("[HATA]")}-`);
    
    if (client.token === tokens[tokens.length - 1]) {
      console.log(`${chalk.magentaBright("[ananın amına koyim]")} Tokenler toplam ( ${gradient.passion(totalJoined)} ) sunucuya sokuldu, ( ${gradient.passion(failed)} ) sunucuya sokulamadı.}`)

      process.title = `sokuldu: ${totalJoined} | sokulamadı: ${failed}`;

    }
  })
}
