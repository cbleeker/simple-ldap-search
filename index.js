var ldap = require('ldapjs');

function LdapSearch(url,bindDN,username,password)
{
  this.ldapIsBound = false
  console.log('Init ldapIsBound is: '+this.ldapIsBound)
  this.base=''
  this.url = url
  //this.attributes =[]
  // this.client = ldap.createClient({
  //     url: url,
  //     reconnect: false
  //     //bindDN: bindDN
  // });
  // if (this.ldapIsBound === false) {
  //   console.dir('Ldap not bound for search, attempting bind')
  //   this.client.bind(username, password, function(err) {
  //     if (err) {
  //       console.dir('Error.  Keeping ldapIsBound = false')
  //       console.dir(err)
  //     }
  //     else {
  //       this.ldapIsBound = true
  //       console.dir('ldapIsBound = true')
  //     }
  //   });
  // }
  // else {
  //   console.dir('Already bound')
  // }

  // this.client.on('connect', function() {
  //   this.ldapIsBound = true
  //   console.warn('LDAP connected.');
  // });

  // this.client.on('error', function(err) {
  //   this.ldapIsBound = false
  //   console.warn('LDAP connection error.', err);
  // });
}

LdapSearch.prototype.search = function (searchString, base, attributes,callback) {
  var self = this
  console.log('lib bound is: '+self.ldapIsBound)
  if (self.ldapIsBound == false) {
      self.client = ldap.createClient({
      url: self.url,
      reconnect: false
      //bindDN: bindDN
    });
    self.client.on('connect', function() {
      self.ldapIsBound = true
      console.warn('LDAP connected.');
    });

    self.client.on('error', function(err) {
      self.ldapIsBound = false
      console.warn('LDAP connection error.', err);
    });
  }

  if (typeof(base) == 'function')
    callback = base
  else {
    self.base = base

    if (typeof(attributes) == 'function')
      callback = attributes
    else
      self.attributes = attributes
  }
  // names = searchString.split(' ')
  // if (names.length > 1)
  // {
  //   l = names.pop()
  //   f = names.join(' ')
  //   filter = '(&(givenName='+f+'*)(sn='+l+'*))'
  // }
  // else
  // {
  //   l = searchString
  //   f = searchString
  //   filter = '(|(givenName='+f+'*)(sn='+l+'*))'
  // }
  filter = 'mail='+searchString
  var opts = {
    filter: filter,
    scope: 'sub',
    attributes: self.attributes
  };
  var results=[];
  self.client.search(self.base,opts, function(err, res) {


    res.on('searchEntry', function(entry) {
      results.push(entry.object)
    });
    res.on('searchReference', function(referral) {

    });
    res.on('error', function(err) {
      callback(err,null)
      //console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
      if (result.status == 0) {
        callback(null,results)
      }
      else {
        error = {}
        error.code = result.status
        callback(error, results)
      }
    });
  });

}

module.exports = LdapSearch;
