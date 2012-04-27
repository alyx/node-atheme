var atheme = exports;

function emptyReply(error, value) { };

atheme.create = function(client, user, ip) {
    return {
        client: client,
        user: user,
        ip: ip
    };
}

atheme.login = function(client, pass) {
    client.client.methodCall('atheme.login', [client.user, pass, client.ipip],
            function(error, value) {
                client.authcookie = value;
            });   
}

atheme.logout = function(client) {
    client.client.methodCall('atheme.logout', [client.authcookie, client.user], emptyReply)
}

atheme.register = function(client, username, password, email) {
    client.methodCall('atheme.command', ['', '', '', 'NickServ', 'REGISTER', username, password, email], emptyReply);
}

atheme.chanserv = {
    kick: function (client, channel, victim, reason) {
              client.client.methodCall('atheme.command', [client.authcookie,
                      client.user, client.ip, 'ChanServ', 'KICK', channel, victim,
                      reason], emptyReply)
          },

    getAccessList: function(client, channel) {
                       if (client.data.chanserv === undefined) client.data.chanserv = new Object;
                       client.client.methodCall('atheme.command', [client.authcookie,
                               client.user, client.ip, 'ChanServ', 'FLAGS', channel],
                               function(error, value) {
                                   var parsedLines = new Array();
                                   var rawLines = value.split("\n");
                                   rawLines.shift();
                                   rawLines.shift();

                                   rawLines.foreach( function(element, index, array) {
                                       var tuple = element.split(' ');
                                       parsedLines.push(tuple);
                                   })
                                   client.data.chanserv.accessList = parsedLines;
                               })
                   },

    getAccessFlags: function(client, channel, nick) {
                        return client.client.methodCall('atheme.command',
                                [client.authcookie, client.user, client.ip,
                                'ChanServ', 'FLAGS', channel, nick],
                                function(error, value) {
                                    return value.split(' ').pop
                                });
                    },

    setAccessFlags: function(client, channel, nick, flags) {
                        client.client.methodCall('atheme.command',
                                [client.authcookie, client.user, client.ip,
                                'ChanServ', 'FLAGS', channel, nick, flags],
                                emptyReply)
                    },

    setProperty: function(client, channel, property, value) {
                     client.client.methodCall('atheme.command',
                             [client.authcookie, client.user, client.ip,
                             'ChanServ', 'SET', channel, property, value],
                             emptyReply)
                 }
};

atheme.hostserv = {
    request: function(client, vhost) {
                 client.client.methodCall('atheme.command',
                         [client.authcookie, client.user, client.ip, 'HostServ', 'REQUEST',
                         vhost], emptyReply);
             }
};

atheme.memoserv = {
    read: function(client, number) {
        if (client.data.memoserv === undefined) client.data.memoserv = new Object();
        
              client.client.methodCall('atheme.command',
                      [client.authcookie, client.user, client.ip, 'MemoServ', 'READ', number],
                      function(error, value) {
                          var rawLine = value.split('\n');

                          var fields = rawLine[0].split(' ', 6);

                          client.data.memoserv.memo = {from: fields[5], message: rawLine[2]};
                      });
          },

    send: function(client, target, message) {
              client.client.methodCall('atheme.command',
                      [client.authcookie, client.user, client.ip, 'MemoServ', 'SEND',
                      target, message], emptyReply);
          },

    sendOps: function(client, target, message) {
                 client.client.methodCall('atheme.command',
                         [client.authcookie, client.user, client.ip, 'MemoServ', 'SENDOPS',
                         target, message], emptyReply);
             },

    forward: function(client, target, id) {
                 client.client.methodCall('atheme.command',
                         [client.authcookie, client.user, client.ip, 'MemoServ', 'FORWARD',
                         target, id], emptyReply);
             },

    remove: function(client, id) {
                client.client.methodCall('atheme.command',
                        [client.authcookie, client.user, client.ip, 'MemoServ', 'DELETE',
                        id], emptyReply);
            },

    ignoreAdd: function(client, target) {
                   client.client.methodCall('atheme.command',
                           [client.authcookie, client.user, client.ip, 'MemoServ', 'IGNORE',
                           'ADD', target], emptyReply);
               },

    ignoreDel: function(client, target) {
                   client.client.methodCall('atheme.command',
                           [client.authcookie, client.user, client.ip, 'MemoServ', 'IGNORE',
                           'DEL', target], emptyReply);
               },

    ignoreClear: function(client) {
                     client.client.methodCall('atheme.command',
                             [client.authcookie, client.user, client.ip, 'MemoServ', 'IGNORE',
                             'CLEAR'], emptyReply);
                 }
};

