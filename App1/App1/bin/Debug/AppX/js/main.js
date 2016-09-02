(function() {
    'use strict';
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel;
    var dates, dates1;
    var val_name = [];
    var val_short = [];
    var course = [];
    var sourceData = [];
    var years = [];
    var file_to_save = "Last.txt";
    var applicationData = Windows.Storage.ApplicationData.current;
    var localFolder = applicationData.localFolder;
    var fileDate;
    var value;




    
  


    WinJS.UI.Pages.define("index.html", {


        ready: function (element, options) {
            //document.getElementById("buttooon2").addEventListener('click', this.LoadDataToSelect, false);
            //pobierz daty
            this.LoadDataToSelect();
            document.getElementById("buttooon2").onclick = function () { loadDate() };
        }
        ,

      LoadDataToSelect: function () {
         
      if (navigator.onLine) {
          //console.log("weeeeeeee")
      }
      years = ["2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016" ]
      years.reverse();


      dates1 = document.getElementById("date_select1");
      for (var j = 0; j < years.length; j++) {
          var opt = document.createElement("option");
          opt.text = years[j];
          opt.value = years[j];
          dates1.appendChild(opt);
      }

      

    document.getElementById("progres").style.visibility = "hidden";
    document.getElementById("table1").style.visibility = "hidden";
    document.getElementById("table2").style.visibility = "hidden";

    loadFile().then(function (data) {
        fileDate = data;
        if (fileDate != null) {
            value = data;
            selectAction()

        }
    });
 
},




      


     

    })



    function saveDate(content) {
        localFolder.createFileAsync(file_to_save, Windows.Storage.CreationCollisionOption.replaceExisting)
        .then(function (file) {
            return Windows.Storage.FileIO.writeTextAsync(file, content);
        }).done(function () {
        });
    }


    function loadFile() {
        var that = this;
        return Windows.Storage.ApplicationData.current.localFolder.getFileAsync(file_to_save).then(function (file) {
            return Windows.Storage.FileIO.readTextAsync(file).then(function (fileContent) {
                console.log("fileContent " + fileContent);
                return fileContent;
            },
            function (error) {
                console.log("Błąd odczytu");
            });
        },
        function (error) {
            console.log("Nie znaleziono pliku");
        });
    }



    function loadDate()
    {
        document.getElementById("date_select").options.length = 0;
        var value = document.getElementById("date_select1").value;
        var xmlHttp = new XMLHttpRequest();
        if (value == 2016) {
            xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/dir.txt');
        }
        else {
            xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/dir' + value + '.txt');
        }// true for asynchronous
        xmlHttp.onreadystatechange = function () {
            var response = xmlHttp.responseText;

            if (xmlHttp.readyState == 4) {
                var transformed_response = response.split('\n');
                var i;
                var daty = [];
                var file = [];
                for (i = 0; i < transformed_response.length - 1; i++) {
                    if (!transformed_response[i].startsWith('a'))
                        continue;


                    var ss = transformed_response[i].substring(9, 11) + "." + transformed_response[i].substring(7, 9) + "." + "20" + transformed_response[i].substring(5, 7);
                    daty[daty.length] = ss;
                    file[file.length] = transformed_response[i];

                }

                daty.reverse();
                file.reverse();
                dates = document.getElementById("date_select");
                for (var j = 0; j < daty.length; j++) {
                    var opt = document.createElement("option");
                    opt.text = daty[j];
                    opt.value = file[j];
                    dates.appendChild(opt);
                }
                dates.onchange = selectAction;
            }
        }

        xmlHttp.send();



    }


    function fillTable(){


        sourceData.length = 0;
        var tableBody = document.getElementById("myTableBody");
     
        var tableRows = tableBody.getElementsByTagName('tr');
        var rowCount = tableRows.length;

        for (var x = rowCount - 1; x >= 0; x--) {
            tableBody.removeChild(tableRows[x]);
        }
     
        var template = document.getElementById("myTemplate").winControl;
        for (var i = 0; i < val_name.length; i++) {
            sourceData.push({ currencyName: val_name[i], currencyCode: val_short[i], averageRate: course[i] });
        }
        sourceData.forEach(function (item) {
            template.render(item, tableBody);
        })

        document.getElementById("table1").style.visibility = "visible";
        document.getElementById("table2").style.visibility = "visible";
        document.getElementById("progres").style.visibility = "hidden";
    }




    function selectAction() {
        
      
 
        if(value == null)   {
            document.getElementById("progres").style.visibility = "visible";
            value = document.getElementById("date_select").value;
        }
        
        saveDate(value);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/' + value +'.xml', false); // true for asynchronous 
        //xmlHttp.log(value)
        xmlHttp.send();
        var xml = xmlHttp.responseXML;
        var pozycje = xml.getElementsByTagName("pozycja");
        for(var i = 0;i < pozycje.length; i++)
        {
            val_name[i] = pozycje[i].getElementsByTagName("nazwa_waluty")[0].childNodes[0].nodeValue;
            val_short[i] = pozycje[i].getElementsByTagName("kod_waluty")[0].childNodes[0].nodeValue;
            course[i] = pozycje[i].getElementsByTagName("kurs_sredni")[0].childNodes[0].nodeValue;
        }
        //promise
        setTimeout(function () { fillTable() }, 2000);
        //fillTable();
        setTimeout(function () {  example4() }, 2000);
        value = null;
    }



  function example4() {
      var table = document.getElementById("myTableBody");
      var rows = table.getElementsByTagName("tr");
      
     

      for (var i = 0; i < rows.length; i++) {

          //gets cells of current row  
          var oCells = table.rows.item(i).cells;
          //gets amount of cells of current row
         
          var cellVal = oCells.item(1).innerHTML;

          rows[i].onclick = (function () {
              var oCellss = table.rows.item(i).cells;
              var x = cellVal = oCellss.item(1).innerHTML;;
              return function() {
                  console.log(x);
                  var value = document.getElementById("date_select1").value;
                  window.location = "page.html?short="+x+"&data="+value;
              }
          })();
      }
  }

    ///live cikle event

}());
