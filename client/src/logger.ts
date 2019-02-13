import {createLogger, format, transports} from "winston";

export function initLogger(config) {
    return createLogger({
        level: config.level,
        format: format.combine(
            format.colorize(),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.splat(),
            format.simple(),
            format.printf(info => `[${info.timestamp}][${info.level}] : ${info.message}`)
        ),
        transports: [
            new transports.File({ filename: "error.log", level: "error" }),
            new transports.Console()
        ]
    });

}
