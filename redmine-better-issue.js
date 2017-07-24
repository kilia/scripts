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

var i;
var status_list = document.getElementsByClassName("status");
var priority_list = document.getElementsByClassName("priority");
var tracker_list = document.getElementsByClassName("tracker");

if(status_list.length != priority_list.length || status_list.length != tracker_list.length) {
    console.log('bad length');
}

for(i=0;i<tracker_list.length;i++) {
    var tk = tracker_list[i];
    var is_bug = false;
    if(tk.firstElementChild.innerText == 'BUG' || tk.firstElementChild.innerText == '��άbug')
        is_bug = true;

    var pr = priority_list[i];
    var is_high = false;
    if(pr.firstElementChild.innerText == '����' || pr.firstElementChild.innerText == '��')
        is_high = true;

    var st = status_list[i];
    var st_style = 'color: #999999';
    if(!is_bug || (is_high && is_bug)) {
        if(st.firstElementChild.innerText == '�½�')
            st_style = 'color: red';
        else if(st.firstElementChild.innerText == '����')
            st_style = 'color: orange';
        else if(st.firstElementChild.innerText == '���' || st.firstElementChild.innerText == 'Ԥ����f�������')
            st_style = 'color: green';
        else
            st_style = 'color: red';
    }

    pr.firstElementChild.style = st_style;
    st.firstElementChild.style = st_style;
    tk.firstElementChild.style = st_style;
}


})();