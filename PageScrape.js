(async () => {
    const commonPaths = [
        "admin", "admin-panel", "admin_login", "administrator", "dashboard",
        "controlpanel", "cpanel", "sysadmin", "moderator", "root", "private",
        "backup", "database", "db", "db_backup", "config", "config.bak",
        "backup.zip", "backup.tar", "config.json", "config.xml", "config.php",
        "settings", "old", "old-site", "backup-old", "test-site", "debug",
        "uploads", "media", "images", "css", "js", "themes", "assets",
        "static", "files", "downloads", "public", "docs", "doc", "documentation",
        ".git", ".svn", ".htaccess", ".htpasswd", ".env", ".config", ".idea",
        "node_modules", "vendor", "logs", "log", "error_log", "debug.log",
        "wp-admin", "wp-content", "wp-includes", "xmlrpc.php", "joomla",
        "drupal", "typo3", "magento", "shop", "cart", "ecommerce",
        "server-status", "server-info", "phpinfo.php", "cgi-bin", "cgi",
        "secure", "secrets", "key", "keys", "ssl", "cert", "certs", "ssh",
        "api", "graphql", "rest", "swagger", "api-docs", "dev", "staging",
        "beta", "test", "test-api", "sandbox", "old-api", "internal",
        "robots.txt", "sitemap.xml", "sitemap", "license", "changelog",
        "README", "readme.txt", "readme.md", "package.json", "composer.json"
    ];
    
    const targets = [
        window.location.origin,
        "https://this.site.com"
    ];

    const foundResources = [];

    for (const baseURL of targets) {
        for (const path of commonPaths) {
            try {
                const res = await fetch(`${baseURL}/${path}`, { method: "HEAD" });
                if (res.ok) {
                    foundResources.push(`${baseURL}/${path}`);
                }
            } catch (e) {}
        }
    }

    const resultMessage = foundResources.length 
        ? "🔍 Discovered Resources:\n" + foundResources.join("\n") 
        : "No hidden resources found.";

    alert(resultMessage); // Display results in a popup window
})();
