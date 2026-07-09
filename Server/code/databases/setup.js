const sql = require("./mysql");
const log = require("./../interface/log");

async function setupDatabase() {
    log("i", "Creating tables");

    const midelightQueries = [
        `
            CREATE TABLE IF NOT EXISTS \`accounts\` (
                \`UID\` varchar(36) NOT NULL,
                \`Email\` varchar(100) NOT NULL,
                \`Username\` varchar(30) NOT NULL,
                \`Password\` text NOT NULL,
                \`Avatar\` varchar(36) DEFAULT NULL,
                \`Banner\` varchar(36) DEFAULT NULL,
                \`Date\` bigint NOT NULL,
                PRIMARY KEY (\`UID\`),
                UNIQUE KEY \`Username\` (\`Username\`),
                UNIQUE KEY \`Email\` (\`Email\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`admins\` (
                \`UID\` varchar(36) NOT NULL,
                \`Key\` text NOT NULL,
                \`Date\` bigint NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`errorlogs\` (
                \`UID\` varchar(36) DEFAULT NULL,
                \`ClientError\` text,
                \`ServerResponse\` text,
                \`Priority\` tinyint(1) DEFAULT NULL,
                \`Fixed\` tinyint(1) NOT NULL,
                \`Time\` bigint DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`forensic\` (
                \`UID\` varchar(36) DEFAULT NULL,
                \`Session\` varchar(36) DEFAULT NULL,
                \`Type\` tinytext,
                \`Content\` mediumtext,
                \`Date\` bigint DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`usageTime\` (
                \`SocketID\` varchar(20) DEFAULT NULL,
                \`UID\` varchar(36) DEFAULT NULL,
                \`Session\` varchar(36) DEFAULT NULL,
                \`clientStartDate\` bigint DEFAULT NULL,
                \`connectDate\` bigint DEFAULT NULL,
                \`disconnectDate\` bigint DEFAULT NULL,
                \`reconnectDate\` bigint DEFAULT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`serverUptime\` (
                \`LaunchID\` int NOT NULL AUTO_INCREMENT,
                \`startDate\` bigint DEFAULT NULL,
                \`exitDate\` bigint DEFAULT NULL,
                PRIMARY KEY (\`LaunchID\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`relog\` (
                \`ID\` varchar(36) NOT NULL,
                \`UID\` varchar(36) DEFAULT NULL,
                \`Date\` bigint DEFAULT NULL,
                PRIMARY KEY (\`ID\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`sessions\` (
                \`ID\` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
                \`Device\` text COLLATE utf8mb4_general_ci NOT NULL,
                \`UID\` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
                \`Date\` bigint DEFAULT NULL,
                PRIMARY KEY (\`ID\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`weatherimages\` (
                \`ID\` varchar(24) NOT NULL,
                \`TimeMin\` int NOT NULL,
                \`TimeMax\` int NOT NULL,
                \`TemperatureMin\` smallint NOT NULL,
                \`TemperatureMax\` smallint NOT NULL,
                \`WeatherType\` varchar(40) NOT NULL,
                PRIMARY KEY (\`ID\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `,
        `
            CREATE TABLE IF NOT EXISTS \`weatherlogs\` (
                \`Time\` bigint NOT NULL,
                \`Temperature\` smallint NOT NULL,
                \`WeatherData\` text NOT NULL,
                \`Latitude\` varchar(10) NOT NULL,
                \`Longitude\` varchar(10) NOT NULL,
                \`UID\` varchar(36) NOT NULL,
                \`City\` varchar(168) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `
    ];

    const writenoteQueries = [
        `
            CREATE TABLE IF NOT EXISTS \`friendRequests\` (
                \`From\` varchar(36) NOT NULL,
                \`To\` varchar(36) NOT NULL,
                \`Date\` bigint NOT NULL,
                UNIQUE KEY \`aRequest\` (\`From\`, \`To\`)
            )
        `,
        `
            CREATE TABLE IF NOT EXISTS \`friends\` (
                \`Friend1\` varchar(36) NOT NULL,
                \`Friend2\` varchar(36) NOT NULL,
                \`Date\` bigint NOT NULL
            )
        `
    ];

    for (const query of midelightQueries) {
        await sql.midelightDB.query(query);
    }

    for (const query of writenoteQueries) {
        await sql.writenoteDB.query(query);
    }

    log("s", "All tables successfully created");
}

module.exports = setupDatabase;