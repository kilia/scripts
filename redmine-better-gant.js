// ==UserScript==
// @name         Redmine Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更好的甘特图
// @author       yuwu@
// @match        http://pangu.pm.netease.com:8099/projects/redmine-system-builder/issues/gantt*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var i;

    var colors = ["#8B0000",
                  "#C0C0C0",
                  "#808080",
                  "#000000",
                  "#FF0000",
                  "#800000",
                  "#FFFF00",
                  "#808000",
                  "#00FF00",
                  "#008000",
                  "#4169E1",
                  "#008080",
                  "#0000FF",
                  "#000080",
                  "#FF00FF",
                  "#800080"];

    function hashCode(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;} ,0);
    }

    try {
        var subjects = document.getElementsByClassName('issue-subject');
        for(i=0;i<subjects.length;i++) {
            try {
                var subject = subjects[i];
                var spannode = subject.firstChild.firstChild.firstChild;
                var subtext = spannode.innerHTML;
                if(subtext.indexOf('#')>0) {
                    spannode.innerHTML = subtext.replace(/.*#/g,'');
                }
            } catch(err) {
                console.log('subject#'+i+':'+err);
            }
        }
    } catch(err) {
        console.log('subjects:'+err);
    }

    var leaves = document.getElementsByClassName("task leaf label");
    if(leaves===null||leaves===undefined) return;
    //console.log(leaves.length);
    for(i=0;i<leaves.length;i++) {
        try {
        //console.log(i);
        var leaf = leaves[i];
        var tip = leaf.nextElementSibling.firstChild;
        var user = tip.innerText.replace(/\n/g,'').replace(/.*指派给: /,'').replace(/优先级.*/,'');
        var prio = tip.innerText.replace(/\n/g,'').replace(/.*优先级: /,'');

        if(prio=='高' || prio=='紧急') {
            prio = '<font color="red">【' + prio + '】</font>';
        } else {
            prio = '&nbsp;';
        }

        var color = colors[hashCode(user)%colors.length];
        //console.log(user + ':' + color);
        var leaf_text = leaf.innerHTML;
        var leaf_color = 'gray';
        if(leaf_text.indexOf('新建')>=0) leaf_color = 'red';
        if(leaf_text.indexOf('接受')>=0) leaf_color = 'blue';
        if(leaf_text.indexOf('完成')>=0) leaf_color = 'gray';
        leaf.innerHTML = '<font color="'+color+'">'+user+'</font>'+prio+'<font color="'+leaf_color+'">' + leaf_text + '</font>';
        } catch(err) {
            console.log('leaf#'+i+':'+err);
        }
    }
})();