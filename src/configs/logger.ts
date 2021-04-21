export const Logger = (level: string, subject: string, message: string) => {

  /* Reformat timestamp for logging events to YYYY-MM-DD HH:MM:SS */
  const logTimestamp = new Date().toISOString().slice(0, 19).split('T').join(' ')

  console.log(`${logTimestamp} | Level: ${level} | Subject: ${subject} | Message: ${message}`)
}