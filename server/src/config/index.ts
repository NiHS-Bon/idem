import * as dotenv from "dotenv";

dotenv.config();

const getConfig = () => {
  const config: Config = {
    port: getEnvVariable("PORT"),
    messageBird: {
      accessKey: getEnvVariable("MESSAGEBIRD_KEY")
    },
    email: {
      support: {
        address: getEnvVariable("SUPPORT_EMAIL_ADDRESS"),
        password: getEnvVariable("SUPPORT_EMAIL_PASSWORD")
      }
    },
    phoneNumberVerification: {
      codeLength: 6,
      originator: "IDEM",
      smsMessage: (code: string) => `Your IDEM verification code is ${code}`
    }
  };

  return config;
};

export default getConfig;

const getEnvVariable = (property: string, canBeUndefined = false): any => {
  const value = process.env[property];

  if (!canBeUndefined && !value) {
    throw new Error(`${property} environment variable is not set`);
  }

  return value;
};
