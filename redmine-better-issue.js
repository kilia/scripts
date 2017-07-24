// ==UserScript==
// @name         Issue Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://pangu.pm.netease.com:8099/projects/redmine-system-builder/issues*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

function hashCode(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;} ,0);
}

var i;
var status_list = document.getElementsByClassName("status");
var priority_list = document.getElementsByClassName("priority");
var tracker_list = document.getElementsByClassName("tracker");
var assigned_list = document.getElementsByClassName("assigned_to");

if(status_list.length != priority_list.length || status_list.length != tracker_list.length) {
    console.log('bad length');
}

for(i=0;i<tracker_list.length;i++) {
    var tk = tracker_list[i];
    var is_bug = false;
    if(tk.firstElementChild.innerText == 'BUG' || tk.firstElementChild.innerText == '运维bug')
        is_bug = true;

    var pr = priority_list[i];
    var is_high = false;
    if(pr.firstElementChild.innerText == '紧急' || pr.firstElementChild.innerText == '高')
        is_high = true;

    var st = status_list[i];
    var st_style = 'color: #999999';
    if(!is_bug || (is_high && is_bug)) {
        if(st.firstElementChild.innerText == '新建')
            st_style = 'color: red; font-weight: bold;';
        else if(st.firstElementChild.innerText == '接受')
            st_style = 'color: blue;';
        else if(st.firstElementChild.innerText == '完成' || st.firstElementChild.innerText == '预发布f测试完成')
            st_style = 'color: #448844;';
        else
            st_style = 'color: red; font-weight: bold;';
    }

    var at = assigned_list[i];
    var name_txt = at.firstElementChild.innerText;
    if(hashCode(name_txt) == 784544) {
        //st.parentElement.style = 'background-color:#99dd99; color:#f8f8f8;';
        at.firstElementChild.outerHTML = '<span style="color:red; background-color:#99dd99;">' + name_txt + '</span>';
    }

    pr.firstElementChild.style = st_style;
    st.firstElementChild.style = st_style;
    tk.firstElementChild.style = st_style;
}

})();