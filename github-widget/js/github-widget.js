
// Generated by CoffeeScript 1.10.0

/*
 * to minify:
java -jar /usr/local/closure-compiler/compiler.jar \
  --compilation_level SIMPLE_OPTIMIZATIONS \
  --js github-widget.js \
  --js_output_file github-widget.min.js
 */


/** @preserve https://github.com/jawj/github-widget
Copyright (c) 2011 - 2012 George MacKerron
Released under the MIT licence: http://opensource.org/licenses/mit-license
 */

(function() {
  var cls, get, init, jsonp, make, makeWidget, text,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    hasProp = {}.hasOwnProperty;

  makeWidget = function(payload, div) {
    var i, len, limit, made, opts, ref, ref1, repo, results, siteRepoNames, sortBy, user;

    make({
      cls: 'gw-clearer',
      prevSib: div
    });
    user = div.getAttribute('data-user');
    opts = div.getAttribute('data-options');
    opts = typeof opts === 'string' ? JSON.parse(opts) : {};
    siteRepoNames = [(user + ".github.com").toLowerCase(), (user + ".github.io").toLowerCase()];
    sortBy = opts.sortBy || 'watchers';
    limit = parseInt(opts.limit) || Infinity;
    made = 0;
    ref = payload.data.sort(function(a, b) {
      // I added this part so that it could sort dates properly
      if (sortBy == "pushed_at" || sortBy == "updated_at") {
        return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime();
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
    results = [];

    for (i = 0, len = ref.length; i < len; i++) {
      repo = ref[i];
      //This part should disable showing forked repos or repos with no description.
      /* if ((!opts.forks && repo.fork) || (ref1 = repo.name.toLowerCase(), indexOf.call(siteRepoNames, ref1) >= 0) || !repo.description) {
        continue;
      } */
      if (made++ === limit) {
        break;
      }
      //Inserted this part to remove the ugly null that shows up if it doesn't have a description. 
      var description;
      if (repo.description == null) {
        description = 'No description available.';
      } else {
        description = repo.description;
      }
        results.push(make({
            parent: div,
            cls: 'style1',
            tag: 'article',
            kids: [
                make({
                    tag: 'span',
                    cls: 'image',
                    kids: [
                        make({
                            tag: 'img',
                            src: 'images/placeholder/pic01.jpg'
                        })
                    ]
                }),
                make({
                    tag: 'a',
                    href: repo.html_url,
                    kids: [
                        make({
                            tag: 'h2',
                            text: repo.name
                        }),
                        make({
                            cls: 'content',
                            text: description
                        })
                    ]
                })
            ]
        }));
    }
      return results;
  };
    
  init = function() {
    var div, i, len, ref, results;
    ref = get({
      tag: 'div',
      cls: 'github-widget'
    });
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      div = ref[i];
      results.push((function(div) {
        var url;
        url = "https://api.github.com/users/" + (div.getAttribute('data-user')) + "/repos?callback=<cb>";
        return jsonp({
          url: url,
          success: function(payload) {
            return makeWidget(payload, div);
          }
        });
      })(div));
    }
    return results;
  };

  cls = function(el, opts) {
    var c, classHash, classes, hasClasses, i, j, len, len1, ref;
    if (opts == null) {
      opts = {};
    }
    classHash = {};
    classes = el.className.match(cls.re);
    if (classes != null) {
      for (i = 0, len = classes.length; i < len; i++) {
        c = classes[i];
        classHash[c] = true;
      }
    }
    hasClasses = (ref = opts.has) != null ? ref.match(cls.re) : void 0;
    if (hasClasses != null) {
      for (j = 0, len1 = hasClasses.length; j < len1; j++) {
        c = hasClasses[j];
        if (!classHash[c]) {
          return false;
        }
      }
      return true;
    }
    return null;
  };

  cls.re = /\S+/g;

  get = function(opts) {
    var el, els, hasCls, inside, ref, ref1, ref2, ref3, tag;
    if (opts == null) {
      opts = {};
    }
    inside = (ref = opts.inside) != null ? ref : document;
    tag = (ref1 = opts.tag) != null ? ref1 : '*';
    if (opts.id != null) {
      return inside.getElementById(opts.id);
    }
    hasCls = opts.cls != null;
    if (hasCls && tag === '*' && (inside.getElementsByClassName != null)) {
      return inside.getElementsByClassName(opts.cls);
    }
    els = inside.getElementsByTagName(tag);
    if (hasCls) {
      els = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = els.length; i < len; i++) {
          el = els[i];
          if (cls(el, {
            has: opts.cls
          })) {
            results.push(el);
          }
        }
        return results;
      })();
    }
    if ((opts.multi == null) && (ref2 = tag.toLowerCase(), indexOf.call(get.uniqueTags, ref2) >= 0)) {
      return (ref3 = els[0]) != null ? ref3 : null;
    } else {
      return els;
    }
  };

  get.uniqueTags = 'html body frameset head title base'.split(' ');

  text = function(t) {
    return document.createTextNode('' + t);
  };

  make = function(opts) {
    var c, i, k, len, ref, t, v;
    if (opts == null) {
      opts = {};
    }
    t = document.createElement((ref = opts.tag) != null ? ref : 'div');
    for (k in opts) {
      if (!hasProp.call(opts, k)) continue;
      v = opts[k];
      switch (k) {
        case 'tag':
          continue;
        case 'parent':
          v.appendChild(t);
          break;
        case 'kids':
          for (i = 0, len = v.length; i < len; i++) {
            c = v[i];
            if (c != null) {
              t.appendChild(c);
            }
          }
          break;
        case 'prevSib':
          v.parentNode.insertBefore(t, v.nextSibling);
          break;
        case 'text':
          t.appendChild(text(v));
          break;
        case 'cls':
          t.className = v;
          break;
        default:
          t[k] = v;
      }
    }
    return t;
  };

  jsonp = function(opts) {
    var callbackName, ref, ref1, url;
    callbackName = (ref = opts.callback) != null ? ref : '_JSONPCallback_' + jsonp.callbackNum++;
    url = opts.url.replace('<cb>', callbackName);
    window[callbackName] = (ref1 = opts.success) != null ? ref1 : jsonp.noop;
    return make({
      tag: 'script',
      src: url,
      parent: get({
        tag: 'head'
      })
    });
  };

  jsonp.callbackNum = 0;

  jsonp.noop = function() {};

  init();

}).call(this);
