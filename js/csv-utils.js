function loadCSV(callback) {
  var xobj = new XMLHttpRequest();
  xobj.open('GET', 'data/results.csv', true)
  xobj.onreadystatechange = function () {
    if(xobj.readyState == 4 && xobj.status == 200) {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function getAllDataFromColumn(csvArray, column) {
  var array = [];
  for (var row = 1; row < csvArray.length; row++) {
    var value = csvArray[row][column];
    if(value === undefined) {
      array.push([ getPredictedTimestampFromRow(csvArray, row, 0).valueOf(), 0 ]);
    }
    else {
      array.push([ getTimestampFromRow(csvArray, row).valueOf(), parseFloat(value) ]);
    }
  }
  return array;
}

function getTimestampFromRow(csvArray, row) {
    if(csvArray[row][3] === undefined) {
        return NaN;
    }
    return moment.utc(csvArray[row][3]).local().add(1, 'h');
}

function getPredictedTimestampFromRow(csvArray, row, count) {
  var timestamp = getTimestampFromRow(csvArray, row);
  if(Number.isNaN(timestamp) && row > 0) {
    return getPredictedTimestampFromRow(csvArray, --row, ++count);
  }
  return timestamp.add(count, 'h');
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}