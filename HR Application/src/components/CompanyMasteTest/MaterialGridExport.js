//"use strict";
const addTotalcol = (data, hiddencol, byColumn, seprator) => {
    var ColArr = [];
    for (var index in data[0]) {
        var p = 0;
        for (var j = 0; j < hiddencol.length; j++) {
            if (index == hiddencol[j]['field']) {
                //dataArr.splice(index, 1); 
                p = 1;
            }
        }
        if (p == 0) {
            ColArr.push(index)
        }
    }
    let keys = ColArr;//Object.keys(data[0]);
    let total = data.reduce((acc, el) => {
        return acc += +(el[byColumn]);
    }, 0);
    //let totalRow = {};
    var totalRow = '';
    let emptyRow = {};
    for (let key of keys) {
        if (key === keys[0]) {
            totalRow += seprator + 'Total' + ',';
        } else if (key === byColumn) {
            totalRow += total + ',';
        } else {
            //totalRow[key] = '';
            totalRow += ',';
        }
        //emptyRow[key] = '';
        emptyRow += ',';
    }
    debugger;
    var q = totalRow;
    return totalRow;
}
const addCountcol = (data, hiddencol, byColumn, seprator) => {
    debugger;
    var ColArr = [];
    for (var index in data[0]) {
        var p = 0;
        for (var j = 0; j < hiddencol.length; j++) {
            if (index == hiddencol[j]['field']) {
                p = 1;
            }
        }
        if (p == 0) {
            ColArr.push(index)
        }
    }
    let keys = ColArr;
    var count = data.length
    //let totalRow = {};
    var totalRow = '';
    let emptyRow = {};
    for (let key of keys) {
        if (key === keys[0]) {
            totalRow += seprator + 'Count' + ',';
        } else if (key === byColumn) {
            totalRow += count + ',';
        } else {
            //totalRow[key] = '';
            totalRow += ',';
        }
        //emptyRow[key] = '';
        emptyRow += ',';
    }
    debugger;
    var q = totalRow;
    return totalRow;
}
const addAveragecol = (data, hiddencol, byColumn, seprator) => {

    var ColArr = [];
    for (var index in data[0]) {
        var p = 0;
        for (var j = 0; j < hiddencol.length; j++) {
            if (index == hiddencol[j]['field']) {
                p = 1;
            }
        }
        if (p == 0) {
            ColArr.push(index)
        }
    }
    let keys = ColArr; //Object.keys(data[0]);
    let total = data.reduce((acc, el) => {
        return acc += +(el[byColumn]);
    }, 0);
    var avg = total / data.length
    //let totalRow = {};
    var totalRow = '';
    let emptyRow = {};
    for (let key of keys) {
        if (key === keys[0]) {
            totalRow += seprator + 'Average' + ',';
        } else if (key === byColumn) {
            totalRow += avg + ',';
        } else {
            //totalRow[key] = '';
            totalRow += ',';
        }
        //emptyRow[key] = '';
        emptyRow += ',';
    }
    debugger;
    var q = totalRow;
    return totalRow;
}

export function GroupcsvExportWithFiveColumn(allColumns, allData, columnhidden, groupColName) {
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = ',,,,,';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }
        }
        strheader += lineh;
    }
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        debugger;
        var data0 = allData[i].value;
        line += data0 + '\r\n'
        for (var k = 0; k < allData[i].groups.length; k++) {
            var data1 = allData[i].groups[k].value;
            line += ',' + data1 + '\r\n';
            for (var l = 0; l < allData[i].groups[k].groups.length; l++) {
                debugger;
                var groupdata = allData[i].groups[k].groups[l];
                var data2 = groupdata.value;
                line += ',,' + data2 + '\r\n';
                for (var j = 0; j < groupdata.groups.length; j++) {
                    debugger;
                    var datag = groupdata.groups[j].value;
                    line += ',,,' + datag + '\r\n' + ','
                    var datagdata = groupdata.groups[j];

                    for (var m = 0; m < datagdata.groups.length; m++) {
                        var datag1 = datagdata.groups[m].value;
                        line += ',,,' + datag1 + '\r\n' + ','
                        var groupdatam = datagdata.groups[m];
                        var dataA = groupdatam.data;
                        var jsonObject = JSON.stringify(dataA);
                        var array1 = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
                        line += ',,,';
                        for (var p = 0; p < array1.length; p++) {
                            if (p != '0') {
                                line += ','
                            }
                            for (var index in array1[p]) {
                                var checkExist = hiddencol.indexOf(index);
                                if (checkExist === -1) {
                                    if (line != '')
                                        line += ','
                                    if (index != 'tableData') {
                                        //line += array1[p][index];
                                        var temp = ''+ array1[p][index];
                                        line += temp.replace(/,/g, "-");
                                    }
                                }
                            }
                            line = line + '\r\n' + ',,,';
                        }
                        line += '\r\n' + addTotalcol(array1, columnhidden, groupColName, ',,,,,') + '\r\n'
                        line += addCountcol(array1, columnhidden, groupColName, ',,,,,') + '\r\n'
                        line += addAveragecol(array1, columnhidden, groupColName, ',,,,,') + '\r\n'
                    }
                    line = line + '\r\n';
                }
            }
        }

    }

    var csv = strheader + '\r\n' + line + '\r\n';
    var exportedFilenmae = "company2" + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export function GroupcsvExportWithFourColumn(allColumns, allData, columnhidden, groupColName) {
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = ',,,,';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }
        }
        strheader += lineh;
    }
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        debugger;
        var data0 = allData[i].value;
        line += data0 + '\r\n'
        for (var k = 0; k < allData[i].groups.length; k++) {
            var data1 = allData[i].groups[k].value;
            line += ',' + data1 + '\r\n';
            for (var l = 0; l < allData[i].groups[k].groups.length; l++) {
                debugger;
                var groupdata = allData[i].groups[k].groups[l];
                var data2 = groupdata.value;
                line += ',,' + data2 + '\r\n';
                for (var j = 0; j < groupdata.groups.length; j++) {
                    debugger;
                    var datag = groupdata.groups[j].value;
                    line += ',,,' + datag + '\r\n' + ','
                    var groupdatam = groupdata.groups[j].data;
                    var dataA = groupdatam;
                    var jsonObject = JSON.stringify(dataA);
                    var array1 = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
                    line += ',,';
                    for (var p = 0; p < array1.length; p++) {
                        if (p != '0') {
                            line += ','
                        }
                        for (var index in array1[p]) {
                            var checkExist = hiddencol.indexOf(index);
                            if (checkExist === -1) {
                                if (line != '')
                                    line += ','
                                if (index != 'tableData') {
                                    //line += array1[p][index];
                                    var temp = ''+ array1[p][index];
                                    line += temp.replace(/,/g, "-");
                                }
                            }
                        }
                        line = line + '\r\n' + ',,';
                    }
                    line += '\r\n' + addTotalcol(array1, columnhidden, groupColName, ',,,,') + '\r\n'
                    line += addCountcol(array1, columnhidden, groupColName, ',,,,') + '\r\n'
                    line += addAveragecol(array1, columnhidden, groupColName, ',,,,') + '\r\n'
                }
                line = line + '\r\n';
            }
        }

    }

    var csv = strheader + '\r\n' + line + '\r\n';
    var exportedFilenmae = "company2" + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
export function GroupcsvExportWithThreeColumn(allColumns, allData, columnhidden, groupColName) {
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = ',,,';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }
        }
        strheader += lineh;
    }
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        debugger;
        var data0 = allData[i].value;
        line += data0 + '\r\n'
        for (var k = 0; k < allData[i].groups.length; k++) {
            var data1 = allData[i].groups[k].value;
            line += ',' + data1 + '\r\n';
            var groupdata = allData[i].groups[k].groups;
            for (var j = 0; j < groupdata.length; j++) {
                debugger;
                var datag = groupdata[j].value;
                line += ',,' + datag + '\r\n' + ','
                var dataA = groupdata[j].data;
                var jsonObject = JSON.stringify(dataA);
                var array1 = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
                line += ',';
                for (var p = 0; p < array1.length; p++) {
                    if (p != '0') {
                        line += ','
                    }
                    for (var index in array1[p]) {
                        var checkExist = hiddencol.indexOf(index);
                        if (checkExist === -1) {
                            if (line != '')
                                line += ','
                            if (index != 'tableData') {
                                //line += array1[p][index];
                                var temp = ''+ array1[p][index];
                                line += temp.replace(/,/g, "-");
                            }
                        }
                    }
                    line = line+'\r\n'+',' ;
                }
                line += '\r\n' + addTotalcol(array1, columnhidden, groupColName, ',,,') + '\r\n'
                line += addCountcol(array1, columnhidden, groupColName, ',,,') + '\r\n'
                line += addAveragecol(array1, columnhidden, groupColName, ',,,') + '\r\n'
            }
            //line = line + '\r\n';
        }
    }

    var csv = strheader + '\r\n' + line + '\r\n';
    var exportedFilenmae = "company2" + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export function GroupcsvExportWithTwoColumn(allColumns, allData, columnhidden, groupColName) {
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = ',,';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }
        }
        strheader += lineh;
    }
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        var data0 = allData[i].value;
        line += data0 + '\r\n'
        var groupdata = allData[i].groups;
        for (var j = 0; j < groupdata.length; j++) {
            var datag = allData[i].groups[j].value;
            line += ',' + datag + '\r\n'
            var dataA = allData[i].groups[j];
            var jsonObject = JSON.stringify(dataA);
            var array = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
            var array1 = array["data"]
            line += ',';
            for (var p = 0; p < array1.length; p++) {
                if (p != '0') {
                    line += ','
                }
                for (var index in array1[p]) {
                    var checkExist = hiddencol.indexOf(index);
                    if (checkExist === -1) {
                        if (line != '')
                            line += ','
                        if (index != 'tableData') {
                            //line += array1[p][index];
                            var temp = ''+ array1[p][index];
                            line += temp.replace(/,/g, "-");
                        }
                    }
                }
                line = line + '\r\n';

            }

            line += addTotalcol(array1, columnhidden, groupColName, ',,') + '\r\n'
            line += addCountcol(array1, columnhidden, groupColName, ',,') + '\r\n'
            line += addAveragecol(array1, columnhidden, groupColName, ',,') + '\r\n'

        }
        line = line + '\r\n';
    }

    var csv = strheader + '\r\n' + line + '\r\n';
    var exportedFilenmae = "company2" + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export function GroupcsvExportWithOneColumn(allColumns, allData, columnhidden, groupColName) {
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = ',';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }
        }
        strheader += lineh;
    }
    var line = '';
    for (var i = 0; i < allData.length; i++) {
        var data0 = allData[i].value;
        line += data0 + '\r\n'
        var groupdata = allData[i].groups;
        var dataA = allData[i];
        var jsonObject = JSON.stringify(dataA);
        var array = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
        var array1 = array["data"];
        for (var p = 0; p < array1.length; p++) {
            for (var index in array1[p]) {
                var checkExist = hiddencol.indexOf(index);
                if (checkExist === -1) {
                    if (line != '')
                        line += ','
                    if (index != 'tableData') {
                        var temp = ''+ array1[p][index];
                        line += temp.replace(/,/g, "-");
                    }
                }
            }
            line = line + '\r\n';
        }
        line += addTotalcol(array1, columnhidden, groupColName, ',') + '\r\n'
        line += addCountcol(array1, columnhidden, groupColName, ',') + '\r\n'
        line += addAveragecol(array1, columnhidden, groupColName, ',') + '\r\n'

    }

    var csv = strheader + '\r\n' + line + '\r\n';
    var exportedFilenmae = "company2" + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

export function GroupcsvExportWithZeroColumn(allColumns, allData, columnhidden, groupColName) {
    var jsonHeader = JSON.stringify(allColumns);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var strheader = '';
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        var lineh = '';
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }
        }
        strheader += lineh;
    }
    var line1 = '';
    for (var i = 0; i < allData.length; i++) {
        var line = '';
        for (var index in allData[i]) {
            var checkExist = hiddencol.indexOf(index);
            if (checkExist === -1) {
                if (line != '')
                    line += ','
                if (index != 'tableData') {
                    var temp = ''+ allData[i][index]
                    line += temp.replace(/,/g, "-");
                }
            }
        }
        line1 = line1 + '\r\n' + line;
    }
    line1 += '\r\n'+addTotalcol(allData, columnhidden, groupColName, '') + '\r\n'
    line1 += addCountcol(allData, columnhidden, groupColName, '') + '\r\n'
    line1 += addAveragecol(allData, columnhidden, groupColName, '') + '\r\n'
    var csv = strheader + line1 + '\r\n';
    var exportedFilenmae = "company2" + '.csv' || 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        debugger;
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        debugger;
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);  
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


export function groupBy(list, keyGetter) {
    debugger;
    const map = new Map();
    var collection;
    list.forEach((item) => {
        const key = keyGetter(item);
        collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return collection;
}

function getInnerDataItem(jsondata, hiddencol, groupColName) {
    debugger;
    var kk = jsondata
    var line1 = ''
    for (var m = 0; m < kk.length; m++) {
        line1 = line1 + '\r\n';
        for (var index1 in kk[m]) {
            var checkExist = hiddencol.indexOf(index1);
            if (checkExist === -1) {
                if (line1 != '') {
                    line1 += ','
                }
            }
            if (index1 != 'tableData') {
                var checkExist = hiddencol.indexOf(index1);
                if (checkExist === -1) {
                    line1 += kk[m][index1];
                }
            }
        }
    }
    var dd = line1;
    line1 += '\r\n' + addTotalcol(jsondata, hiddencol, groupColName, ',') + '\r\n'
    line1 += addCountcol(jsondata, hiddencol, groupColName, ',') + '\r\n'
    line1 += addAveragecol(jsondata, hiddencol, groupColName, ',') + '\r\n'
    return line1;
}

export function exportCSVFile(headers, items, fileTitle, Groupexist, columnhidden, groupColName) {
    if (headers) {
        //  items.unshift(headers);
    }
    var jsonObject = JSON.stringify(items);
    var array = typeof jsonObject != 'object' ? JSON.parse(jsonObject) : jsonObject;
    var jsonHeader = JSON.stringify(headers);
    var header = typeof jsonObject != 'object' ? JSON.parse(jsonHeader) : jsonHeader;
    var str = '';
    var strheader = '';
    if (Groupexist) {
        var strheader = ',';
    }
    var hiddencol = [];
    for (var ch = 0; ch < columnhidden.length; ch++) {
        hiddencol[ch] = columnhidden[ch]['field']
    }
    for (var i = 0; i < header.length; i++) {
        debugger;
        var lineh = '';
        var pp = header[i]['field'];
        for (var index in header[i]) {
            if (index != 'hidden' && index != 'hiddenByColumnsButton') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    if (lineh != '')
                        lineh += ','
                }
            }
            if (index == 'field') {
                var checkExist = hiddencol.indexOf(header[i][index]);
                if (checkExist === -1) {
                    lineh += ''
                    lineh += header[i][index]
                }
            }

        }
        strheader += lineh;
    }

    for (var i = 0; i < array.length; i++) {
        debugger;
        var line = '';
        for (var index in array[i]) {
            var checkExist = hiddencol.indexOf(index);
            if (checkExist === -1) {
                if (line != '')
                    line += ','
            }
            if (Groupexist) {
                if (index == 'value') {
                    debugger;
                    var checkExist = hiddencol.indexOf(index);
                    if (checkExist === -1) {
                        line += array[i][index];
                    }
                }
                if (index == 'data') {
                    debugger;
                    line += ''
                    line += getInnerDataItem(array[i][index], hiddencol, groupColName)
                }
            }
            else {

                if (index != 'tableData') {
                    var checkExist = hiddencol.indexOf(index);
                    if (checkExist === -1) {
                        line += array[i][index];
                    }

                }
            }
        }
        str += line + '\r\n';
    }
    if (!Groupexist) {
        debugger;
        str += addTotalcol(array, columnhidden, groupColName, '') + '\r\n'
        str += addCountcol(array, columnhidden, groupColName, '') + '\r\n'
        str += addAveragecol(array, columnhidden, groupColName, '') + '\r\n'
    }
    debugger;
    var csv = strheader + '\r\n' + str;
    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}