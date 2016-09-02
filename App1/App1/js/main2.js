(function () {
    'use strict';
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var dates,dates1;
    var val_all = [];
    var val_short = [];
    var dates_all = [];
    var course = [];
    var sourceData = [];

    ////////////////////////////////////////////
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    ////////////////////////////////////////////////////


    var file = [];
    var daty = [];
    var s,y;
    function LoadDataToSelect() {
        if (navigator.onLine) {
            console.log("weeeeeeee")
        }

        document.getElementById("progress").style.visibility = "hidden";
        s = getUrlParameter('short');
        console.log(s);
       
        var xmlHttp = new XMLHttpRequest();
        y = getUrlParameter('data');
        if(y == 2016){
            xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/dir.txt'); // true for asynchronous 
        }
        else {
            xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/dir' + y + '.txt');
        }
        xmlHttp.onreadystatechange = function () {
            var response = xmlHttp.responseText;

            if (xmlHttp.readyState == 4) {
                var transformed_response = response.split('\n');
                var i;
                
                //var file = [];
                for (i = 0; i < transformed_response.length - 1; i++) {
                    if (!transformed_response[i].startsWith('a'))
                        continue;


                    var ss = transformed_response[i].substring(9, 11) + "." + transformed_response[i].substring(7, 9) + "." + "20" + transformed_response[i].substring(5, 7);
                    daty[daty.length] = ss;
                    file[file.length] = transformed_response[i];

                }
              

                daty.reverse();
                file.reverse();
                dates = document.getElementById("date_start");
                for (var j = 0; j < daty.length; j++) {
                    var opt = document.createElement("option");
                    opt.text = daty[j];
                    opt.value = file[j];
                    dates.appendChild(opt);
                }
               // dates.onchange = function () { selectAction() };

                /////////////////// select 2

                dates1 = document.getElementById("date_end");
                
                for (var j = 0; j < daty.length; j++) {
                    var opt = document.createElement("option");
                    opt.text = daty[j];
                    opt.value = file[j];
                    dates1.appendChild(opt);
                }
               // dates1.onchange = function () { selectAction() };

               
            }

        }

        xmlHttp.send();
    }
  
    //document.getElementById("button1").onclick = function () { getDatas() };
    //document.getElementById("buttooon1").addEventListener('click',getDatas(),false);
   


    function getDatas() {
        document.getElementById("progress").style.visibility = "visible";
        var from = document.getElementById("date_start").selectedIndex;
        var to = document.getElementById("date_end").selectedIndex;

        console.log(from + ":" + to);


        if (from < to) {
            console.log("blad");

        }
        else {


            var data_list = [];;
            var i = 0;
            data_list = [];
            dates_all = [];
            val_all = [];
            while (from >= to) {
                data_list[data_list.length] = file[from];
                dates_all[dates_all.length] = daty[from];
                from--;
            }

            console.log("Wielkosc"+data_list.length);

            var i;
            for ( i = 0; i < data_list.length;i++)
            {
                var xmlHttp = new XMLHttpRequest();

                xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/' + data_list[i] + '.xml', false); // true for asynchronous 
                //xmlHttp.log(value)
                xmlHttp.send();
                var xml = xmlHttp.responseXML;
                var pozycje = xml.getElementsByTagName("pozycja");
                for (var j = 0; j < pozycje.length; j++) {
                    if (pozycje[j].getElementsByTagName("kod_waluty")[0].childNodes[0].nodeValue == s)
                        val_all[val_all.length] = pozycje[j].getElementsByTagName("kurs_sredni")[0].childNodes[0].nodeValue;
                   
                }

            }
            console.log(val_all[0])
            rysuj();

        }

    }
  

   /* function selectAction() {
        document.getElementById("progres").style.visibility = "visible";
        var value = document.getElementById("date_select").value;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://www.nbp.pl/kursy/xml/' + value + '.xml', false); // true for asynchronous 
        //xmlHttp.log(value)
        xmlHttp.send();
        var xml = xmlHttp.responseXML;
        var pozycje = xml.getElementsByTagName("pozycja");
        for (var i = 0; i < pozycje.length; i++) {
            val_name[i] = pozycje[i].getElementsByTagName("nazwa_waluty")[0].childNodes[0].nodeValue;
            val_short[i] = pozycje[i].getElementsByTagName("kod_waluty")[0].childNodes[0].nodeValue;
            course[i] = pozycje[i].getElementsByTagName("kurs_sredni")[0].childNodes[0].nodeValue;
        }
        //promise
        setTimeout(function () { fillTable() }, 2000);
        //fillTable();
        setTimeout(function () { example4() }, 2000);

    }*/




    window.onload = function () {
        LoadDataToSelect();
        document.getElementById("buttooon1").onclick = function () { getDatas() };
        document.getElementById("buttooon2").onclick = function () { Back() };
    
        function Back()
    {
      window.location = "index.html";
    }

    };

    
  

    function rysuj(){

        var najmniejszy = val_all[0];
        var najwiekszy = val_all[0];
 

        for (var i = 0; i < val_all.length; i++) {
            if (val_all[i] < najmniejszy) {
                najmniejszy = val_all[i];
            }
            if (val_all[i] > najwiekszy) {
                najwiekszy = val_all[i];
                console.log(najwiekszy);
            }
        }
        var slicer = (najwiekszy - najmniejszy) / 8;
        var y_val = [];
        for (var j = 0; j < val_all.length; j++) {
            var s = val_all[j];
            s = s.replace(",", ".");
            
            y_val[j] = parseFloat(s);
         

        }

        var dps = []
        console.log(dps.length)
        dps = [{ label: dates_all[0], y: y_val[0] }];
      
        
        
        ////////////////////////rysowanie
       
            console.log(typeof chart)
            var chart = new CanvasJS.Chart("chartContainer",
            {
                title: {
                    text: "Wykres"
                },
                axisX: {
                    title: "Daty",
                    valueFormatString: "string"
                },
                axisY: {
                    title: "Kurs",
                    includeZero: false
                },
                data: [{
                    type: "line",
                    dataPoints: dps
                }]
            });

            chart.render();
            console.log(chart.options.data[0].dataPoints.length)
            
                for (var i = 1; i < val_all.length; i++) {

                    dps.push({ label: dates_all[i], y: y_val[i] });

                }
             
                chart.render();
            
                document.getElementById("progress").style.visibility = "hidden";
        }

       
        
     
       

    

/*
    function rysuj1() {

        var canvas = document.getElementById("myCanvas");
        var context = canvas.getContext("2d");
        

        var margin = 40;
        var width = 600;
        var height = 500;
        ////lewy gorny rog
        var lewy = margin;
        var dol = height - margin;
        var gora = margin;
        var prawy = width - margin;
        var separator = 10;

        //linie wykresu



        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = '#0000FF';
        context.moveTo(lewy, gora);
        context.lineTo(lewy, dol);
        context.stroke();
        context.moveTo(lewy, dol);
        context.lineTo(prawy, dol);
        context.stroke();

        //strzałki
        context.moveTo(lewy, gora);
        context.lineTo(lewy - 6, gora + 6);
        context.stroke();
        context.moveTo(lewy, gora);
        context.lineTo(lewy + 6, gora + 6);
        context.stroke();
        context.moveTo(prawy, dol);
        context.lineTo(prawy - 6, dol + 6);
        context.stroke();
        context.moveTo(prawy, dol);
        context.lineTo(prawy - 6, dol - 6);
        context.stroke();
        //Legenda kurs
        context.strokeStyle = '#000F00';
        context.lineWidth = 1;
        context.font = "14px Calibri";
        context.strokeText("K", 20, 150);
        context.strokeText("U", 20, 165);
        context.strokeText("R", 20, 180);
        context.strokeText("S", 20, 195);
        //Legenda Data
        context.font = "14px Calibri";
        context.strokeText("Data", 200, height - 20);
        var heightWykresu = height - margin - separator;
        var widthWykresu = width - 2 * margin;




        context.closePath();
        context.beginPath();
        context.strokeStyle = '#FF0000';
        context.lineWidth = 1;
        var najmniejszy = val_all[0];
        var najwiekszy = val_all[0];


        for (var i = 0; i < val_all.length; i++) {
            if (val_all[i] < najmniejszy) {
                najmniejszy = val_all[i];
            }
            if (val_all[i] > najwiekszy) {
                najwiekszy = val_all[i];
                console.log(najwiekszy);
            }
        }
        var slicer = (najwiekszy - najmniejszy) / 8;

        //współczynniki przez które pomnożony punkt otrzyma wysokość i szerokość
        var wspolczynnikSzerokosciPunktu = widthWykresu / (val_all.length - 1);
        var wspolczynnikWysokosciPunktu = (heightWykresu - margin - separator * 4) / (najwiekszy - najmniejszy);

        //punkt startowy
        var lastx = margin;
        var lasty = heightWykresu - (val_all[0] - najmniejszy) * wspolczynnikWysokosciPunktu;

        //kolejnt punkty z tablicy records
        for (var i = 1; i < val_all.length; i++) {
            context.moveTo(Math.round(lastx), Math.round(lasty));
            lastx = i * wspolczynnikSzerokosciPunktu + 40;
            lasty = heightWykresu - (val_all[i] - najmniejszy) * wspolczynnikWysokosciPunktu;
            context.lineTo(Math.round(lastx), Math.round(lasty));
            context.stroke();
        }

        //zmiana koloru
        context.closePath();
        context.beginPath();
        context.strokeStyle = '#00FFFF';

        //linia najwyższego kursu
        context.moveTo(Math.round(lewy), Math.round(heightWykresu - (najwiekszy - najmniejszy) * wspolczynnikWysokosciPunktu));
        context.lineTo(Math.round(prawy), Math.round(heightWykresu - (najwiekszy - najmniejszy) * wspolczynnikWysokosciPunktu));
        context.stroke();

        //linia najniższego kursu
        context.moveTo(Math.round(lewy), Math.round(heightWykresu - (najmniejszy - najmniejszy) * wspolczynnikWysokosciPunktu));
        context.lineTo(Math.round(prawy), Math.round(heightWykresu - (najmniejszy - najmniejszy) * wspolczynnikWysokosciPunktu));
        context.stroke();

        //opis najwyższego kursu
        context.strokeStyle = '#0F0F0F';
        context.lineWidth = 1;
        context.font = "12px Calibri";
        context.strokeText(najwiekszy, Math.round(lewy + widthWykresu / 2), Math.round(heightWykresu - (najwiekszy - najmniejszy) * wspolczynnikWysokosciPunktu) - 4);


        //opis najniższego kursu
        context.strokeStyle = '#0F0F0F';
        context.lineWidth = 1;
        context.font = "12px Calibri";
        context.strokeText(najmniejszy, Math.round(lewy + widthWykresu / 2), Math.round(heightWykresu - (najmniejszy - najmniejszy) * wspolczynnikWysokosciPunktu) - 4);




    }*/


   










    /*
       app.onactivated = function (args) {
              if (args.detail.kind === activation.ActivationKind.launch) {
                  if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                      // TODO: This application has been newly launched. Initialize your application here.
                  } else {
                      // TODO: This application has been reactivated from suspension.
                      // Restore application state here.
                  }
                  args.setPromise(WinJS.UI.processAll().then(function () {
                      // TODO: Your code here.
      
                    
                  }));
              }
          };
          app.oncheckpoint = function (args) {
              // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
              // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
              // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
          };
          app.start();
      }());*/}());
  