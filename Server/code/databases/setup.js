const sql = require("./mysql");

// sql.midelightDB.query(`DROP DATABASE midelight`);
// sql.midelightDB.query(`CREATE DATABASE Midelight`);
// sql.midelightDB.query(`USE Midelight`);

sql.midelightDB.query(`
    CREATE TABLE \`accounts\` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`admins\` (
        \`UID\` varchar(36) NOT NULL,
        \`Key\` text NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`errorlogs\` (
        \`UID\` varchar(36) DEFAULT NULL,
        \`ClientError\` text,
        \`ServerResponse\` text,
        \`Priority\` tinyint(1) DEFAULT NULL,
        \`Fixed\` tinyint(1) NOT NULL,
        \`Time\` bigint DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`forensic\` (
        \`UID\` varchar(36) DEFAULT NULL,
        \`Session\` varchar(36) DEFAULT NULL,
        \`Type\` tinytext,
        \`Content\` mediumtext,
        \`Date\` bigint DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`usageTime\` (
        \`SocketID\` varchar(20) DEFAULT NULL,
        \`UID\` varchar(36) DEFAULT NULL,
        \`Session\` varchar(36) DEFAULT NULL,
        \`clientStartDate\` bigint DEFAULT NULL,
        \`connectDate\` bigint DEFAULT NULL,
        \`disconnectDate\` bigint DEFAULT NULL,
        \`reconnectDate\` bigint DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`serverUptime\` (
        \`LaunchID\` int NOT NULL AUTO_INCREMENT,
        \`startDate\` bigint DEFAULT NULL,
        \`exitDate\` bigint DEFAULT NULL,
        PRIMARY KEY (\`LaunchID\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);


sql.midelightDB.query(`
    CREATE TABLE \`relog\` (
        \`ID\` varchar(36) NOT NULL,
        \`UID\` varchar(36) DEFAULT NULL,
        \`Date\` bigint DEFAULT NULL,
        PRIMARY KEY (\`ID\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`sessions\` (
        \`ID\` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
        \`Device\` text COLLATE utf8mb4_general_ci NOT NULL,
        \`UID\` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
        \`Date\` bigint DEFAULT NULL,
        PRIMARY KEY (\`ID\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`);

sql.midelightDB.query(`
    CREATE TABLE \`weatherlogs\` (
        \`Time\` bigint NOT NULL,
        \`Temperature\` smallint NOT NULL,
        \`WeatherData\` text NOT NULL,
        \`Latitude\` varchar(10) NOT NULL,
        \`Longitude\` varchar(10) NOT NULL,
        \`UID\` varchar(36) NOT NULL,
        \`City\` varchar(168) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`);

sql.writenoteDB.query(`
    CREATE TABLE \`friendRequests\` (
        \`From\` varchar(36) NOT NULL,
        \`To\` varchar(36) NOT NULL,
        \`Date\` bigint NOT NULL,
        UNIQUE KEY \`aRequest\` (\`From\`,\`To\`)
    )
`);

sql.writenoteDB.query(`
    CREATE TABLE \`friends\` (
        \`Friend1\` varchar(36) NOT NULL,
        \`Friend2\` varchar(36) NOT NULL,
        \`Date\` bigint NOT NULL
    )
`);
