var http = new XMLHttpRequest; 
var idObtenido;
var padre;
var fechaActual = new Date();

window.onload = function()
{
    var container=document.getElementById("container");  
    var loading= document.getElementById("loading");
    var tabla= document.getElementById("tabla");
    var label= document.getElementById("txtLista");
    //var mostrar= document.getElementById("btnMostrar"); 
  // mostrarSegun(true, false, false, false); //loading
    
   /* container.hidden=true; 
    loading.hidden=true;
    tabla.hidden=false;
    label.hidden=false; */
               
            
    http.onreadystatechange = callback;
    http.open("GET", "http://localhost:3000/materias",true);
    http.send(); 

    var cerrar=this.document.getElementById("btnCerrar");
    cerrar.onclick=function()
    {
        setTimeout(mostrarSegun(true,false,true,true), 500);
        mostrarSegun(true,true,false,false);
    } 
                
        var editar = document.getElementById("btnModificar");
        editar.onclick=function() //al modificar, no desaparece, xq no puedo si no mostrar el error.
        {
            peticionPost("POST","http://localhost:3000/editar",true);
            //antes de hacer todo, un if para saber que me response el servidor.
            //if((peticionPost("POST","http://localhost:3000/editar",true).response)=="ok")
           // {
                //funcionara NOO
            //}

            hijo= padre.childNodes;
            //console.log(hijo[1].textContent);
            hijo[0].textContent=idObtenido;
            if(chequearDatosConAviso(document.getElementById("materia").value))
            {
                hijo[1].textContent=document.getElementById("materia").value;
                var fecha= (document.getElementById("fecha").value).split('-');
                var fechaCorrecta= fecha[2]+'/'+fecha[1]+'/'+fecha[0];
                hijo [3].textContent=  fechaCorrecta;
                if(document.getElementById("turnoMa").checked == true)
                {                
                    //hijo[4].textContent=='Mañana';  //no me modifica
                    hijo[4].textContent= document.getElementById("turnoMa").value; //esto tmp
                }
                else if (document.getElementById("turnoNo").checked == true) 
                {                
                    //hijo[4].textContent=='Noche';
                    hijo[4].textContent= document.getElementById("turnoNo").value;

                }  
                container.hidden=true;
            } 
            //hijo[2].textContent=(document.getElementById("cuatrimestre").value); Me gustaba poder cambiar la materia
                     
        }

        var eliminar = document.getElementById("btnEliminar");
        eliminar.onclick=function()
        {
            peticionPostId("POST", "http://localhost:3000/eliminar", true, idObtenido)
            console.log(idObtenido);
            padre.remove();
            //padre.removeChild(hijo[1]); //esto lo elimina, va borra ese contenido 
            //VALIDAR CON IF TYPE is ok.               
        }
}

        function mostrarSegun(container1, loading2, tabla3, label4)
        {
            var container=document.getElementById("container");  
            var loading= document.getElementById("loading");
            var tabla= document.getElementById("tabla");
            var label= document.getElementById("txtLista");
            container.hidden=container1; 
            loading.hidden=loading2;
            tabla.hidden=tabla3;
            label.hidden=label4;
        }   
        function peticionPostId(metodo, url, funcion, id)
        {
            http.onreadystatechange =funcion;
            http.open(metodo, url, true);
            http.setRequestHeader("Content-Type","application/json");
            var data = {id:id}; //y agregue esto               
            http.send(JSON.stringify(data)); //modifique esto pero igual
            container.hidden=true;
            //loading.hidden=false;
        }
            
        function callback()
        {
            if(http.readyState == 4 && http.status==200)
            {
                armarGrilla(JSON.parse(http.responseText));  
                mostrarSegun(true, true, false, false);
                //loading, hiddden true. Segun el profesor
            }
            //else if( si es 4 y no es 200)
            else
            {
                console.log("este error");
            }
        }    
            
            function armarGrilla(jsonObj)
            {
                var tabla=document.getElementById("tabla");
                for (var i=0; i<jsonObj.length; i++) 
                {
                    var tr = document.createElement("tr"); //Creo la fila
                    //tr.setAttribute("idPersona",i+1); //invento el id
                    var tdId = document.createElement("td"); 
                    var text = document.createTextNode(jsonObj[i].id); //pero tmb lo tengo aca el id
                    tdId.appendChild(text) 
                    tr.appendChild(tdId);
                    tdId.hidden=true;
                    /*Esto se va a repetir por cada celda que quiera mostrar --- inicio*/
                    var td = document.createElement("td"); //creo la celda
                    var text = document.createTextNode(jsonObj[i].nombre); //creo el texto adentro de la celda
                    td.appendChild(text) 
                    tr.appendChild(td);
                    var tdApe = document.createElement("td"); 
                    var text = document.createTextNode(jsonObj[i].cuatrimestre); 
                    tdApe.appendChild(text) 
                    tr.appendChild(tdApe); 
                    
                    var tdFec = document.createElement("td"); 
                    var text = document.createTextNode(jsonObj[i].fechaFinal); 
                    tdFec.appendChild(text) 
                    tr.appendChild(tdFec);

                    var tdSxc = document.createElement("td"); 
                    var text = document.createTextNode(jsonObj[i].turno); 
                    tdSxc.appendChild(text) 
                    tr.appendChild(tdSxc);
                    
                    tr.addEventListener("dblclick",clickGrilla);

                    tabla.appendChild(tr);
                }
            }

        function peticionPost(metodo,url,funcion)
        {
            http.onreadystatechange =funcion;
            http.open(metodo, url, true);
            http.setRequestHeader("Content-Type","application/json");
            if ((document.getElementById("turnoMa").checked==true) && (chequearDatos(document.getElementById("materia").value), document.getElementById("fecha").value))
            {
                var data = {id:idObtenido,nombre:document.getElementById("materia").value,cuatrimestre:checkCuatrimestre(document.getElementById("cuatrimestre").value),fechaFinal:document.getElementById("fecha").value,turno:document.getElementById("turnoMa").value};
            }
            else if ((document.getElementById("turnoNo").checked==true)&& (chequearDatos(document.getElementById("materia").value), document.getElementById("fecha").value))
            {
                var data = {id:idObtenido,nombre:document.getElementById("materia").value,cuatrimestre:checkCuatrimestre(document.getElementById("cuatrimestre").value),fechaFinal:document.getElementById("fecha").value,turno:document.getElementById("turnoNo").value};
            }
            else if((document.getElementById("turnoMa").checked==false)&&(document.getElementById("turnoNo").checked==false))
            {
                data= null;
            }
            http.send(JSON.stringify(data));
            //container.hidden=true; Si lo pongo no muestra el rojo
            //loading.hidden=false; Segun el profesor

        }

        function peticionSet(metodo,url,funcion)
        {
            http.onreadystatechange =funcion;
            http.open(metodo, url, true);            
            http.send();
            mostrarSegun(true, true, false, true);
            //container.hidden=true;
            //loading.hidden=true;
        }

        function clickGrilla(e)
        {
            //container.hidden=false;
            mostrarSegun(false, true, false, false);
            padre= e.target.parentNode;
            hijo= padre.childNodes;
            //console.log(padre);
            idObtenido=hijo[0].textContent;
            document.getElementById("materia").value= hijo[1].textContent;
            //document.getElementById("user").value= hijo[0].innerHTML; se puede escribir de las dos formas
            //var cuatr= document.getElementById("cuatrimestre").value;
            checkCuatrimestre(hijo[2].textContent);            
            var fecha= (hijo [3].textContent).split('/');
            var fechaCorrecta= fecha[2]+'-'+fecha[1]+'-'+fecha[0];
            document.getElementById("fecha").value = fechaCorrecta;
            if(hijo[4].textContent=="Mañana")
            {
                document.getElementById("turnoMa").checked = true   
            }
            else if (hijo[3].textContent=="Noche") 
            {
                document.getElementById("turnoNo").checked = true
            } 
        }

        function chequearDatos(nombre)
        {
            var retorno = true;
            //var fechaActual= new Date();
            //var fechaIngresada = Date(fecha);
            if(nombre.value == "" || nombre.length<6) 
            {
                document.getElementById("materia").className="classError";
                retorno = false;
            }                         
            return retorno;
        }

        function chequearDatosConAviso(nombre, apellido)
        {
            var retorno = true;

            if(nombre.value == "" || nombre.length<6)
            {
                document.getElementById("materia").className="classError";
                alert("Debe ingresar nombre con mas de 3 letras");
                retorno = false;
            }                
            return retorno;
        }

        function checkCuatrimestre(cuatr)
        {
            //alert(cuatr);
            indice=cuatr-1;
            //alert(indice);

            retorno="";
            if(cuatr==1)
            {
                document.getElementById('cuatrimestre').getElementsByTagName('option')[indice].selected= 'selected';
            }
            if(cuatr == 2)
            {
                document.getElementById('cuatrimestre').getElementsByTagName('option')[indice].selected= 'selected';
            }
            if(cuatr==3)
            {
                document.getElementById('cuatrimestre').getElementsByTagName('option')[indice].selected = 'selected';
            }
            if(cuatr == 4)
            {
                document.getElementById('cuatrimestre').getElementsByTagName('option')[indice].selected  = 'selected';
            }
        }


