const readline = require("readline");
const { exec } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("input otp: ", function (otp) {
  exec(
    `
    aws sts get-session-token --duration-seconds 129600 --serial-number arn:aws:iam::467873314609:mfa/mackiel.ramos --token-code ${otp} --profile user`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      const cred = JSON.parse(stdout);

      const awscmd = `aws configure set aws_access_key_id ${cred.Credentials.AccessKeyId}; aws configure set aws_secret_access_key ${cred.Credentials.SecretAccessKey}; aws configure set aws_session_token ${cred.Credentials.SessionToken};`;

      console.log(awscmd);

      exec(awscmd, (error1, stdout1, stderr1) => {
        if (error1) {
          console.log(`error1: ${error1.message}`);
          return;
        }
        if (stderr1) {
          console.log(`stderr1: ${stderr1}`);
          return;
        }
        exec(
          "aws codeartifact login --tool npm --repository pdax-web-artifacts --domain pdax-web",
          (error2, stdout2, stderr2) => {
            if (error2) {
              console.log(`error2: ${error2.message}`);
              return;
            }
            if (stderr2) {
              console.log(`stderr2: ${stderr2}`);
              return;
            }
            console.log(stdout2);
            rl.close();
          }
        );
      });
    }
  );
});

rl.on("close", function () {
  process.exit(0);
});
