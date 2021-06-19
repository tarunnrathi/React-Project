"use strict";
const addTotalcol = (data, hiddencol, byColumn, seprator) => {
    var ColArr = [];
    debugger;
    for (var index in data[0]) {
        var p = 0;
        if (index != 'tableData') {
            for (var j = 0; j < hiddencol.length; j++) {
                if (index == hiddencol[j]['field']) {
                    p = 1;
                }
            }
            if (p == 0) {
                ColArr.push(index)
            }
        }
    }
    var total = [];
    let keys = ColArr;//Object.keys(data[0]);
    for (var c = 0; c < byColumn.length; c++) {
        total[c] = data.reduce((acc, el) => { return acc += +(el[byColumn[c]]); }, 0);
    }
    var totalRow = '<tr>';
    let emptyRow = {};
    for (let key of keys) {
        if (key === keys[0]) {
            totalRow += seprator + '<td style="font-weight:bold;border-top: thin solid;border-bottom: thin solid;">Total</td>';
        } else if (key !== keys[0]) {       // (key === byColumn)
            var p = 0;
            for (var j = 0; j < byColumn.length; j++) {
                if (key == byColumn[j]) {

                    totalRow += '<td style="font-weight:bold;text-align:center;border-top: thin solid;border-bottom: thin solid;">' + total[j] + '</td>';
                    p = 1;
                }
            }
            if (p === 0) {
                totalRow += '<td style="border-top: thin solid;border-bottom: thin solid;"></td>';
            }
        }

    }
    debugger;
    var q = totalRow;
    totalRow = totalRow + '</tr>';
    return totalRow;
}
const addCountcol = (data, hiddencol, byColumn, seprator) => {
    debugger;
    var ColArr = [];
    for (var index in data[0]) {
        var p = 0;
        if (index != 'tableData') {
            for (var j = 0; j < hiddencol.length; j++) {
                if (index == hiddencol[j]['field']) {
                    p = 1;
                }
            }
            if (p == 0) {
                ColArr.push(index)
            }
        }
    }
    let keys = ColArr;
    var count = data.length
    //let totalRow = {};
    var totalRow = '<tr>';
    let emptyRow = {};
    for (let key of keys) {
        if (key === keys[0]) {
            totalRow += seprator + '<td style="font-weight:bold;">Count</td>';
        } else {       // (key === byColumn)
            var p = 0;
            for (var j = 0; j < byColumn.length; j++) {
                if (key == byColumn[j]) {
                    totalRow += '<td style="font-weight:bold;">' + count + '</td>';
                    p = 1;
                }
            }
            if (p === 0) {
                totalRow += '<td></td>';
            }
        }
    }
    debugger;
    totalRow += '</tr>';
    return totalRow;
}
const addAveragecol = (data, hiddencol, byColumn, seprator) => {
    var ColArr = [];
    for (var index in data[0]) {
        var p = 0;
        if (index != 'tableData') {
            for (var j = 0; j < hiddencol.length; j++) {
                if (index == hiddencol[j]['field']) {
                    p = 1;
                }
            }
            if (p == 0) {
                ColArr.push(index)
            }
        }
    }
    let keys = ColArr; //Object.keys(data[0]);
    var avg = [];//total / data.length
    var total = [];
    for (var c = 0; c < byColumn.length; c++) {
        total[c] = data.reduce((acc, el) => { return acc += +(el[byColumn[c]]); }, 0);
        avg[c] = (total[c] / data.length).toFixed(2);
    }
    var totalRow = '<tr>';
    let emptyRow = {};
    for (let key of keys) {
        if (key === keys[0]) {
            totalRow += seprator + '<td style="font-weight:bold;">Average</td>';
        } else {       // (key === byColumn)
            var p = 0;
            for (var j = 0; j < byColumn.length; j++) {
                if (key == byColumn[j]) {
                    totalRow += '<td style="font-weight:bold;">' + avg[j] + '</td>';
                    p = 1;
                }
            }
            if (p === 0) {
                totalRow += '<td></td>';
            }
        }
    }
    debugger;
    totalRow += '</tr>';
    return totalRow;
}

export function GroupPdfExportWithFiveColumn(allColumns, allData, columnhidden, groupColName, ReportTitle, TopHeader) {  //addtotal,addAvg,addCount,
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var collength = Number(allColumns.length) + 5
    var strheader = '<table>' + TopHeader + '<tr style="font-weight:bold;font-size:22;text-align:center;background-color:cyan;"><td colspan=' + collength + '>' + ReportTitle + '</td></tr>';
    strheader += '<tr style="font-weight:bold;background-color:pink;font-size:16"><td></td><td></td><td></td><td></td><td></td>'
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += '<td>' + header[i][index] + '</td>'
                }
            }
        }
        strheader += lineh;
    }
    strheader += '</tr>'
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        line += '<tr>'
        var data0 = allData[i].value;
        line += '<td style="font-weight:bold;font-size:14">' + data0 + '</td></tr><tr>'
        for (var k = 0; k < allData[i].groups.length; k++) {
            var data1 = allData[i].groups[k].value;
            line += '<td></td><td style="font-weight:bold;font-size:14">' + data1 + '</td></tr><tr>'
            for (var l = 0; l < allData[i].groups[k].groups.length; l++) {
                debugger;
                var groupdata = allData[i].groups[k].groups[l];
                var data2 = groupdata.value;
                line += '<td></td><td></td><td style="font-weight:bold;font-size:14">' + data2 + '</td></tr><tr>';
                for (var j = 0; j < groupdata.groups.length; j++) {
                    debugger;
                    var datag = groupdata.groups[j].value;
                    line += '<td></td><td></td><td></td><td style="font-weight:bold;font-size:14">' + datag + '</td></tr><tr>'
                    var datagdata = groupdata.groups[j];

                    for (var m = 0; m < datagdata.groups.length; m++) {
                        var datag1 = datagdata.groups[m].value;
                        line += '<td></td><td></td><td></td><td></td><td style="font-weight:bold;font-size:14">' + datag1 + '</td></tr><tr>'
                        var groupdatam = datagdata.groups[m];
                        var dataA = groupdatam.data;
                        var jsonObject = JSON.stringify(dataA);
                        var array1 = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
                        for (var p = 0; p < array1.length; p++) {
                            debugger;
                            line += '<td></td><td></td><td></td><td></td><td></td>';
                            for (var index in array1[p]) {
                                debugger;
                                var checkExist = hiddencol.indexOf(index);
                                if (checkExist === -1) {
                                    if (index != 'tableData') {
                                        var temp = '' + array1[p][index];
                                        //line += '<td>'+temp+'</td>'
                                        if (p == array1.length - 1) //make Total column bold
                                        {
                                            if (temp == 'Total') {
                                                line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;">' + temp + '</td>';
                                                continue;
                                            }
                                            var checkColExist = groupColName.indexOf(index);
                                            if (checkColExist === -1) {
                                                line += '<td style="border-top: thin solid;border-bottom: thin solid;"></td>';
                                            }
                                            else {
                                                line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;text-align:center">' + temp + '</td>';
                                            }
                                        }
                                        else {
                                            line += '<td style="text-align:center">' + temp + '</td>';
                                        }
                                    }
                                }
                            }
                            line = line + '</tr>'
                        }
                        // if(addtotal){
                        // line += addTotalcol(array1, columnhidden, groupColName, '<td></td><td></td><td></td><td></td><td></td>') }
                        // if(addCount){
                        // line += addCountcol(array1, columnhidden, groupColName, '<td></td><td></td><td></td><td></td><td></td>') }
                        // if(addAvg){
                        // line += addAveragecol(array1, columnhidden, groupColName, '<td></td><td></td><td></td><td></td><td></td>') }
                    }

                }
            }
        }

    }

    var pdf = strheader + line
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(pdf);
    printWin.document.close();
    printWin.print();
}

export function GroupPdfExportWithFourColumn(allColumns, allData, columnhidden, groupColName, ReportTitle, TopHeader) {    //addtotal,addAvg,addCount,
    debugger;
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var collength = Number(allColumns.length) + 4
    var strheader = '<table>' + TopHeader + '<tr style="font-weight:bold;font-size:22;text-align:center;background-color:cyan;"><td colspan=' + collength + '>' + ReportTitle + '</td></tr>';
    strheader += '<tr style="font-weight:bold;background-color:pink;font-size:16"><td></td><td></td><td></td><td></td>'
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += '<td>' + header[i][index] + '</td>'
                }
            }
        }
        strheader += lineh;
    }
    strheader += '</tr>'
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        line += '<tr>'
        var data0 = allData[i].value;
        line += '<td style="font-weight:bold;font-size:14">' + data0 + '</td></tr><tr>'
        for (var k = 0; k < allData[i].groups.length; k++) {
            var data1 = allData[i].groups[k].value;
            line += '<td></td><td style="font-weight:bold;font-size:14">' + data1 + '</td></tr><tr>';
            for (var l = 0; l < allData[i].groups[k].groups.length; l++) {
                debugger;
                var groupdata = allData[i].groups[k].groups[l];
                var data2 = groupdata.value;
                line += '<td></td><td></td><td style="font-weight:bold;font-size:14">' + data2 + '</td></tr><tr>';
                for (var j = 0; j < groupdata.groups.length; j++) {
                    debugger;
                    var datag = groupdata.groups[j].value;
                    line += '<td></td><td></td><td></td><td style="font-weight:bold;font-size:14">' + datag + '</td></tr><tr>'
                    var groupdatam = groupdata.groups[j].data;
                    var dataA = groupdatam;
                    var jsonObject = JSON.stringify(dataA);
                    var array1 = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
                    for (var p = 0; p < array1.length; p++) {
                        line += '<td></td><td></td><td></td><td></td>';
                        for (var index in array1[p]) {
                            debugger;
                            var checkExist = hiddencol.indexOf(index);
                            if (checkExist === -1) {
                                if (index != 'tableData') {
                                    var temp = '' + array1[p][index];
                                    // line += '<td>'+temp+'</td>'
                                    if (p == array1.length - 1) //make Total column bold
                                    {
                                        if (temp == 'Total') {
                                            line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;">' + temp + '</td>';
                                            continue;
                                        }
                                        var checkColExist = groupColName.indexOf(index);
                                        if (checkColExist === -1) {
                                            line += '<td style="border-top: thin solid;border-bottom: thin solid;"></td>';
                                        }
                                        else {
                                            line += '<td style="border-top: thin solid;border-bottom: thin solid;text-align:center">' + temp + '</td>';
                                        }
                                    }
                                    else {
                                        line += '<td style="text-align:center">' + temp + '</td>';
                                    }
                                }
                            }
                        }
                        line = line + '</tr>'
                    }
                    // if(addtotal){
                    // line += addTotalcol(array1, columnhidden, groupColName, '<td></td><td></td><td></td><td></td>') }
                    // if(addCount){
                    // line += addCountcol(array1, columnhidden, groupColName, '<td></td><td></td><td></td><td></td>') }
                    // if(addAvg){
                    // line += addAveragecol(array1, columnhidden, groupColName, '<td></td><td></td><td></td><td></td>')}
                }

            }
        }

    }

    var pdf = strheader + line
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(pdf);
    printWin.document.close();
    printWin.print();
}
export function GroupPdfExportWithThreeColumn(allColumns, allData, columnhidden, groupColName, ReportTitle, TopHeader) { //addtotal,addAvg,addCount,
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var collength = Number(allColumns.length) + 3
    var strheader = '<table>' + TopHeader + '<tr style="font-weight:bold;font-size:22;text-align:center;background-color:cyan;"><td colspan=' + collength + '>' + ReportTitle + ' </td></tr>';
    strheader += '<tr style="font-weight:bold;background-color:pink;font-size:16"><td></td><td></td><td></td>'
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += '<td>' + header[i][index] + '</td>'
                }
            }
        }
        strheader += lineh;
    }
    strheader += '</tr>'
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        line += '<tr>'
        var data0 = allData[i].value;
        line += '<td style="font-weight:bold;font-size:14">' + data0 + '</td></tr><tr>'
        for (var k = 0; k < allData[i].groups.length; k++) {
            var data1 = allData[i].groups[k].value;
            line += '<td></td><td style="font-weight:bold;font-size:14">' + data1 + '</td></tr><tr>';
            var groupdata = allData[i].groups[k].groups;
            for (var j = 0; j < groupdata.length; j++) {
                debugger;
                var datag = groupdata[j].value;
                line += '<td></td><td></td><td style="font-weight:bold;font-size:14">' + datag + '</td></tr><tr>'
                var dataA = groupdata[j].data;
                var jsonObject = JSON.stringify(dataA);
                var array1 = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;

                for (var p = 0; p < array1.length; p++) {
                    line += '<td></td><td></td><td></td>';
                    for (var index in array1[p]) {
                        var checkExist = hiddencol.indexOf(index);
                        if (checkExist === -1) {
                            if (index != 'tableData') {
                                var temp = '' + array1[p][index];
                                //line += '<td>'+temp+'</td>';
                                if (p == array1.length - 1) //make Total column bold
                                {
                                    if (temp == 'Total') {
                                        line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;">' + temp + '</td>';
                                        continue;
                                    }
                                    var checkColExist = groupColName.indexOf(index);
                                    if (checkColExist === -1) {
                                        line += '<td style="border-top: thin solid;border-bottom: thin solid;"></td>';
                                    }
                                    else {
                                        line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;text-align:center">' + temp + '</td>';
                                    }
                                }
                                else {
                                    line += '<td style="text-align:center">' + temp + '</td>';
                                }
                            }
                        }
                    }
                    line = line + '</tr>';
                }
                // if(addtotal){
                // line += addTotalcol(array1, columnhidden, groupColName, '<td></td><td></td><td></td>') }
                // if(addCount){
                // line += addCountcol(array1, columnhidden, groupColName, '<td></td><td></td><td></td>') }
                // if(addAvg){
                // line += addAveragecol(array1, columnhidden, groupColName, '<td></td><td></td><td></td>')}
            }
        }
    }

    var pdf = strheader + line
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(pdf);
    printWin.document.close();
    printWin.print();
}

export function GroupPdfExportWithTwoColumn(allColumns, allData, columnhidden, groupColName, ReportTitle, TopHeader) {  //addtotal,addAvg,addCount,
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var collength = Number(allColumns.length) + 2
    var strheader = '<table>' + TopHeader + '<tr style="font-weight:bold;font-size:22;text-align:center;background-color:cyan;"><td colspan=' + collength + '>' + ReportTitle + ' </td></tr>';
    strheader += '<tr style="font-weight:bold;background-color:pink;font-size:16"><td></td><td></td>'
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {

            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += '<td>' + header[i][index] + '</td>'
                }
            }
        }
        strheader += lineh;
    }
    strheader += '</tr>'
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        line += '<tr>'
        var data0 = allData[i].value;
        line += '<td style="font-weight:bold;font-size:14">' + data0 + '</td></tr><tr>'
        var groupdata = allData[i].groups;
        for (var j = 0; j < groupdata.length; j++) {
            var datag = allData[i].groups[j].value;
            line += '<td></td><td style="font-weight:bold;font-size:14">' + datag + '</td></tr><tr>'
            var dataA = allData[i].groups[j];
            var jsonObject = JSON.stringify(dataA);
            var array = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
            var array1 = array["data"]
            line += '';
            for (var p = 0; p < array1.length; p++) {
                line += '<td></td><td></td>';

                for (var index in array1[p]) {
                    var checkExist = hiddencol.indexOf(index);
                    if (checkExist === -1) {

                        if (index != 'tableData') {

                            var temp = '' + array1[p][index];
                            //line += '<td>'+ temp +'</td>';
                            if (p == array1.length - 1) //make Total column bold
                            {
                                if (temp == 'Total') {
                                    line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;">' + temp + '</td>';
                                    continue;
                                }
                                var checkColExist = groupColName.indexOf(index);
                                if (checkColExist === -1) {
                                    line += '<td style="border-top: thin solid;border-bottom: thin solid;"></td>';
                                }
                                else {
                                    line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;text-align:center;">' + temp + '</td>';
                                }
                            }
                            else {
                                line += '<td style="text-align:center;">' + temp + '</td>';
                            }
                        }
                    }
                }
                line = line + '</tr>';

            }

            // if(addtotal){
            //    line += addTotalcol(array1, columnhidden, groupColName, '<td></td><td></td>')}
            // if(addCount){
            //   line += addCountcol(array1, columnhidden, groupColName, '<td></td><td></td>') }
            // if(addAvg){
            //  line += addAveragecol(array1, columnhidden, groupColName, '<td></td><td></td>') }
        }

    }

    var pdf = strheader + line
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(pdf);
    printWin.document.close();
    printWin.print();
}

export function GroupPdfExportWithOneColumn(allColumns, allData, columnhidden, groupColName, ReportTitle, TopHeader) {  //addtotal,addAvg,addCount,
    debugger;
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var collength = Number(allColumns.length) + 1
    var strheader = '<table>' + TopHeader + '<tr style="font-weight:bold;font-size:22;text-align:center;background-color:cyan;"><td colspan=' + collength + '>' + ReportTitle + ' </td></tr>';
    strheader += '<tr style="font-weight:bold;background-color:pink;font-size:16"><td></td>'
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    var lineh = ''
    for (var i = 0; i < header.length; i++) {
        lineh = ''
        for (var index in header[i]) {

            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += '<td>' + header[i][index] + '</td>'
                }
            }
        }
        strheader += lineh;
    }
    strheader += '</tr>'
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        line += '<tr>'
        var data0 = allData[i].value;
        line += '<td style="font-weight:bold;font-size:14">' + data0 + '</td></tr>'
        var groupdata = allData[i].groups;
        var dataA = allData[i];
        var jsonObject = JSON.stringify(dataA);
        var array = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
        var array1 = array["data"];
        for (var p = 0; p < array1.length; p++) {
            line += '<tr><td></td>'
            for (var index in array1[p]) {
                debugger;
                var checkExist = hiddencol.indexOf(index);
                if (checkExist === -1) {
                    if (index != 'tableData') {
                        var temp = '' + array1[p][index];
                        if (p == array1.length - 1) //make Total column bold
                        {
                            if (temp == 'Total') {
                                line += '<td style="font-weight:bold;font-size:14;border-top: thin solid;border-bottom: thin solid;">' + temp + '</td>';
                                continue;
                            }
                            var checkColExist = groupColName.indexOf(index);
                            if (checkColExist === -1) {
                                line += '<td style="border-top: thin solid;border-bottom: thin solid;"></td>';
                            }
                            else {
                                line += '<td style="font-weight:bold;font-size:14;text-align:center;border-top: thin solid;border-bottom: thin solid;">' + temp + '</td>';
                            }

                        }
                        else {
                            line += '<td style="text-align:center;">' + temp + '</td>';
                        }
                    }
                }
            }
            line = line + '</tr>';
        }

        // if(addtotal){
        // line += addTotalcol(array1, columnhidden, groupColName, '<td></td>')}
        // if(addCount){
        // line += addCountcol(array1, columnhidden, groupColName, '<td></td>') }
        // if(addAvg){
        // line += addAveragecol(array1, columnhidden, groupColName, '<td></td>') }

    }

    var pdf = strheader + line
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(pdf);
    printWin.document.close();
    printWin.print();
}

export function GroupPdfExportWithZeroColumn(allColumns, allData, columnhidden, groupColName, addtotal, addAvg, addCount, ReportTitle, TopHeader) {
    var jsonHeader = JSON.stringify(allColumns);
    debugger;
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = '<table>' + TopHeader + '<tr style="font-weight:bold;font-size:22;text-align:center;background-color:cyan;"><td colspan=' + allColumns.length + '>' + ReportTitle + ' </td></tr><tr style="background-color:pink;font-size:16">';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += '<td>' + header[i][index] + '</td>'
                }
            }
        }
        strheader += lineh;
    }
    strheader += '</tr>'
    var line1 = '';
    for (var i = 0; i < allData.length; i++) {
        debugger;
        var line = '<tr>';
        for (var index in allData[i]) {
            var checkExist = hiddencol.indexOf(index);
            if (checkExist === -1) {
                if (index != 'tableData') {
                    var temp = '' + allData[i][index]
                    line += '<td style="text-align:center;">' + temp + '</td>';
                }
            }
        }

        line1 = line1 + line + '</tr>';
    }

    if (addtotal) {
        line1 += addTotalcol(allData, columnhidden, groupColName, '')
    }
    if (addCount) {
        line1 += addCountcol(allData, columnhidden, groupColName, '')
    }
    if (addAvg) {
        line1 += addAveragecol(allData, columnhidden, groupColName, '')
    }

    var pdf = strheader + line1
    var printWin = window.open("", "");
    printWin.document.open();
    printWin.document.write(pdf);
    printWin.document.close();
    printWin.print();

}






