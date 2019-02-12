import {createLogger, format, transports} from "winston";

export function initLogger(config) {
    return createLogger({
        level: config.level,
        format: format.combine(
            format.colorize(),
            format.splat(),
            format.simple()
        ),
        transports: [
            new transports.File({ filename: "error.log", level: "error" }),
            new transports.Console()
        ]
    });

}
