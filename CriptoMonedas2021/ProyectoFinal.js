function draw_multiseries(w, h, archivoDatos,criptos) {
    
    // HECHO POR CARLOS MARTIN SANZ

    // PARSEA LA FECHA A ESE FORMATO

    var parseTime = d3.timeParse("%Y-%m-%d");
    
    // TENDRA EL MAXIMO DE LOS VALORES
    
    var maximo = 0;                        

    // MARGENES

    var margin_x = 252;
    var margin_y = 80;

    // AJUSTE DE X E Y

    var x = d3.scaleTime().range([0,w]); 
    var y = d3.scaleLinear().range([h,0]); 

    var dias = 0;            // CONTIENE EL Nº DE DIAS DEL CSV
    var precios = [];       // ARRAY CON TODOS LOS PRECIOS

    // ARRAY CON LOS PRECIOS DE CADA CRIPTO

    var valorEth = [];
    var valorLtc = [];
    var valorXmr = [];
    var valorBnb = [];

    var visible = true;      // RECTA VISIBLE O NO, TRUE SI, FALSE NO
    
    // LECTURA DE LOS DATOS

    d3.csv(archivoDatos).then(function(data) {

        data.forEach(function(d) {
            d.binance = +d.binance;
            d.litecoin = +d.litecoin;
            d.monero = +d.monero;
            d.ethereum = +d.ethereum;
            d.date = parseTime(d.date);
            if(d.date != null){
                dias = dias+1;
            }

            // SEGUN SI ESTA SELECCIONADA LO METE O NO EN EL ARRAY DE MAXIMOS

            if(criptos[0] == true){
                precios.push(d.ethereum);
                valorEth.push(parseFloat(d.ethereum,10))
            }
            if(criptos[1] == true){
                precios.push(d.litecoin)
                valorLtc.push(parseFloat(d.litecoin,10))
            }
            if(criptos[2] == true){
                precios.push(d.binance)
                valorBnb.push(parseFloat(d.binance,10))
            }
            if(criptos[3] == true){
                precios.push(d.monero)
                valorXmr.push(parseFloat(d.monero,10))
            }

        });

    
    // HALLA EL MAXIMO DE LOS VALORES, PARA PONERLO COMO LIMITE
        
    for (var k = 0; k < precios.length; k++) {
        maximo =  Math.max(maximo, precios[k]);
    }

    var ntick = 0;

    //RANGO DE FECHAS DEL EJE X

    var fechaMinima = d3.min(data,function(d){return d.date; })
    var fechaMaxima = d3.max(data,function(d){return d.date; })

    // DOMINIOS DE LOS EJES

    x.domain([fechaMinima,fechaMaxima])
    y.domain([0, maximo+10]);                                                                       // DE 0 AL VALOR MAXIMO DEPENDIENDO DE CUAL HA SIDO SELECCIONADA
        
    // TICK DEPENDIENDO DEL DIA DEL MES

    if(dias == 90 | dias == 91){
        ntick = 10;
    }else{
        ntick = 13;
    }

    // EJES

    var xAxis = d3.axisBottom(x).ticks(ntick).tickFormat(d3.timeFormat("%d-%m-%y")); 
    var yAxis = d3.axisLeft(y).ticks(30); 

    // CELDAS DEL FONDO

    var yGrid = d3.axisLeft(y).ticks(30).tickSize(-w, 0, 0).tickFormat("");
    var xGrid = d3.axisBottom(x).ticks(ntick).tickSize(h, 0, 0).tickFormat("");

    var svg = d3.select("body").append("svg").attr("width", w-180 + margin_x + margin_x) // Elementos svg
        .attr("height", h+150 + margin_y + margin_y).append("g")
        .attr("transform", "translate(" + margin_x + "," + margin_y + ")");
    
    // ANADE EL EJE X

    svg.append("g").attr("class", "x axis").attr("color","#0A0A0A").attr("transform", "translate(0," + h + ")").transition().duration(1000).call(xAxis); // Eje X
    d3.select('.x')
        .selectAll('text')
        .attr("dx", "-1.30em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)");

    // ANADE EL EJE Y

    svg.append("g").attr("class", "y axis").attr("color","#0A0A0A").transition().duration(1000).call(yAxis); // Eje Y*/
    
    // ANADE LAS REJILLAS

    svg.append("g").attr("class", "grid").attr("color","#eeeeee").transition().duration(1000).call(yGrid);
    svg.append("g").attr("class", "grid").attr("color","#eeeeee").transition().duration(1000).call(xGrid);        

    // ANIMACION DE LAS LINEAS, QUE APARECEN POCO A POCO

    function transition(path) {
        path.transition()
        .duration(2100)
        .attrTween("stroke-dasharray", animacionLinea);
    }
            
    function animacionLinea() {
        var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }
    
    // SI ESTA SELECCIONADO EL CHECKBOX, ENTONCES LA CRIPTO ESTA DENTO DEL ARRAY, ENTONCES CREA LA LINEA CORRESPONDIENTE
    // TRUE = ESTA SELECCIONADA // FALSE = NO ESTA SELECCIONADA 

    if(criptos[0] == true){
        var lineaEthereum = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.ethereum); });
    }
    
    if(criptos[1] == true){
        var lineaLitecoin = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.litecoin); });
    }
    
    if(criptos[2] == true){
        var lineaBinance = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.binance); });
    }
    
    if(criptos[3] == true){
        var lineaMonero = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.monero); });
    }

    // FUNCION QUE LIMITA EL NUMERO DE DECIMALES A 7, PARA QUE SE AJUSTE AL TAMANO DEL RECTANGULO

    function acotarValor(x) {
        return Number.parseFloat(x).toFixed(7);
    }
        
    if(criptos[0] == true){

        // ANADE LA LINEA

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#332F2C")
            .style("stroke-width",3.3)
            .attr("fill","none")
            .attr("d", lineaEthereum)
            .on("click",clickaLinea)
            .call(transition);

        // ANADE LOS PUNTOS

        svg.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","dotEth")
            .attr("r", 3.8)
            .attr("fecha",function(d){ return (d.date).toLocaleDateString(); })
            .attr("valor",function(d){ return acotarValor(d.ethereum)})
            .attr("valorExacto",function(d){ return d.ethereum})
            .style("fill","#332F2C")
            .on("mouseover",mouseOn)
            .on("mouseout",mouseOut)
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.ethereum); });
    }

    if(criptos[1] == true){

        //ANADE LA LINEA

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#3B83BD")
            .style("stroke-width",3.3)
            .attr("fill","none")
            .attr("d", lineaLitecoin)
            .on("click",clickaLinea)
            .call(transition);

        // ANADE LOS PUNTOS

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class","dotLtc")
            .attr("r", 3.8)
            .attr("fecha",function(d){ return (d.date).toLocaleDateString(); })
            .attr("valor",function(d){ return acotarValor(d.litecoin)})
            .attr("valorExacto",function(d){ return d.litecoin})
            .style("fill","#3B83BD")
            .on("mouseover",mouseOn)
            .on("mouseout",mouseOut)
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.litecoin); });
    }

    if(criptos[2] == true){

        //ANADE LA LINEA

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "orange")
            .style("stroke-width",3.3)
            .attr("fill","none")
            .attr("d", lineaBinance)
            .on("click",clickaLinea)
            .call(transition);
                    
        // ANADE LOS PUNTOS

        svg.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class","dotBnb")
            .attr("r", 3.8)
            .attr("fecha",function(d){ return (d.date).toLocaleDateString(); })
            .attr("valor",function(d){ return acotarValor(d.binance)})
            .attr("valorExacto",function(d){ return d.binance})
            .style("fill","orange")
            .on("mouseover",mouseOn)
            .on("mouseout",mouseOut)
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.binance); });
        }


    if(criptos[3] == true){
            
        //ANADE LA LINEA

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "red")
            .style("stroke-width",3.3)
            .attr("fill","none")
            .attr("d", lineaMonero)
            .on("click",clickaLinea)
            .call(transition);
            
        // ANADE LOS PUNTOS
   
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class","dotXmr")
            .attr("r", 3.8)
            .attr("fecha",function(d){ return (d.date).toLocaleDateString(); })
            .attr("valor",function(d){ return acotarValor(d.monero)})
            .attr("valorExacto",function(d){ return d.monero})
            .style("fill","red")
            .on("mouseover",mouseOn)
            .on("mouseout",mouseOut)
            .transition()
            .duration(1500)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.monero); })
            ;
    }


    //INSERTA IMAGENES DE LAS CRIPTOS
    
    var img = svg.append("g").attr("class","image");
    
    // ANADE IMAGEN ETHEREUM 

    if(criptos[0] == true){
            img.append('image')
                .data(data)
                .attr('xlink:href', "logoEthereum.png")
                .attr('x',-60)
                .attr("y", function(d) {return y(+d.ethereum+4);})   // ANADE EN LA POSICION ADECUADA 
                .attr('width', 20)
                .attr('height', 20)
                .attr("opacity", .0)
                .transition()
                .duration(1600)
                .attr("opacity", .9);
    }

    // ANADE IMAGEN LITECOIN
        
    if(criptos[1] == true){
        img.append('image')
            .data(data)
            .attr('xlink:href', "litecoin.png")
            .attr('x',-60)
            .attr("y", function(d) {return y(+d.litecoin+4);})
            .attr('width', 20)
            .attr('height', 20)
            .attr("opacity", .0)
            .transition()
            .duration(1600)
            .attr("opacity", .9);
    }

    // ANADE IMAGEN BINANCE

    if(criptos[2] == true){
        img.append('image')
            .data(data)
            .attr('xlink:href', "logoBinanceCoin.png")
            .attr('x',-60)
            .attr("y", function(d) {return y(+d.binance+2);})
            .attr('width', 20)
            .attr('height', 20)
            .attr("opacity", .0)
            .transition()
            .duration(1600)
            .attr("opacity", .9);
    }

    // ANADE IMAGEN MONERO
    
    if(criptos[3] == true){
        img.append('image')
            .data(data)
            .attr('xlink:href', "monero.png")
            .attr('x',-60)
            .attr("y", function(d) {return y(+d.monero+4);})
            .attr('width', 20)
            .attr('height', 20)
            .attr("opacity", .0)
            .transition()
            .duration(1600)
            .attr("opacity", .9);
    }
        
    // ETIQUETAS DE LOS EJES

    var labels = svg.append("g")
        .attr("class", "labels");

    // ETIQUETA PARA EL EJE X
        
    labels.append("text")
        .attr("transform", "translate(0, " + h + ")")
        .attr("x", (w-15))
        .attr("y", 48)
        .attr("dx", "-1.0em")
        .attr("dy", "2.0em")
        .attr("opacity", .0)
        .text("Días")
        .transition()
        .duration(1600)
        .attr("opacity", .9);

    // ETIQUETA PARA EL EJE Y

    labels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", "-.5em")
        .style("text-anchor", "end")
        .attr("opacity", .0)
        .text("Valor ($)")
        .transition()
        .duration(1600)
        .attr("opacity", .9);

    // TITULO DEL GRAFICO

    var title = svg.append("g").attr("class", "title");
	    
    title.append("text").attr("x", (w / 2)).attr("y", -50 )
	    .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .attr("opacity", .0)
        .style("font-weight", "bold")
        .style("fill","#2271B3")
        .text("VALOR DE MERCADO CRIPTOMONEDAS 2019-2021")
        .transition()
        .duration(1600)
        .attr("opacity", .9);

    // HACE QUE EL RESTO DE LINEAS SE VUELVAN MAS TRASPARENTES

    function clickaLinea(){
        if(visible == true & d3.select(this).style("opacity") == 1){
            d3.selectAll(".line,.dotEth,.dotBnb,.dotLtc,.dotXmr").style("opacity",0.1);
            d3.select(this).style("opacity",1);
            visible = false;
        }else if(visible == false & d3.select(this).style("opacity") == 1){
            d3.selectAll(".line,.dotEth,.dotBnb,.dotLtc,.dotXmr").style("opacity",1);
            visible = true;
        }
    }

    // INTERACCION PONER EL RATON ENCIMA DEL PUNTO

    function mouseOn() { 

        // ANIMACION QUE AUMENTA EL TAMANO DEL PUNTO

        d3.select(this)
            .transition()
            .duration(300)
            .style("fill",d3.select(this).style("fill"))
            .attr("stroke","none")
            .attr("r",7.7)

        // GENERA EL RECTANGULO 

        svg.append("rect")
            .attr("class","datosrectangulo")
            .attr("stroke","black")
            .attr("x", d3.select(this).attr('cx')-45)
            .attr("y", d3.select(this).attr('cy')-43)
            .attr("width",115)
            .attr("height",35)
            .attr("fill",d3.select(this).style('fill'))
            .attr("opacity",".100")
        d3.select(".datosrectangulo")
            .transition()
            .duration(400)
            .attr("opacity", .5)

        // GENERA EL TEXTO DE DENTRO DEL RECTANGULO

        svg.append('text')
            .attr('class','texto_valor')
            .attr("x", d3.select(this).attr('cx')-38)
            .attr("y", d3.select(this).attr('cy')-28)
            .attr("font-size",12)
            .text('Fecha: '+d3.select(this).attr("fecha"))
            .append('svg:tspan')
            .attr('x', d3.select(this).attr('cx')-38)
            .attr('dy', 14)
            .text('Valor: '+d3.select(this).attr("valor")+" $")
            var buscar = d3.select(this).attr("valorExacto");
            if(d3.select(this).attr('class') == 'dotEth'){
                var indice = valorEth.indexOf(parseFloat(buscar,10));
            }
            if(d3.select(this).attr('class') == 'dotLtc'){
                var indice = valorLtc.indexOf(parseFloat(buscar,10));
            }
            if(d3.select(this).attr('class') == 'dotXmr'){
                var indice = valorXmr.indexOf(parseFloat(buscar,10));
            }
            if(d3.select(this).attr('class') == 'dotBnb'){
                var indice = valorBnb.indexOf(parseFloat(buscar,10));
            }
            var anterior = indice-1;
            var porc = 0;
            if(indice==0){
                porc = 0;
                svg.append('text')
                .attr('class','porcentaje')
                .attr("font-size",14)
                .style("fill","orange")
                .attr("x", d3.select(this).attr('cx')+10)
                .attr("y", d3.select(this).attr('cy')-50)
                .text('+'+ Number.parseFloat(porc).toFixed(2)+' %')
            }else{
                if(d3.select(this).attr('class') == 'dotEth'){
                porc = ((buscar/valorEth[anterior])*100)-100;
                }
                if(d3.select(this).attr('class') == 'dotLtc'){
                    porc = ((buscar/valorLtc[anterior])*100)-100;
                }
                if(d3.select(this).attr('class') == 'dotXmr'){
                    porc = ((buscar/valorXmr[anterior])*100)-100;
                    }
                if(d3.select(this).attr('class') == 'dotBnb'){
                    porc = ((buscar/valorBnb[anterior])*100)-100;
                }

                if(porc > 0){
                    svg.append('text')
                        .attr('class','porcentaje')
                        .attr("font-size",14)
                        .style("fill","green")
                        .attr("x", d3.select(this).attr('cx')+65)
                        .attr("y", d3.select(this).attr('cy')-50)
                        .text('+'+ Number.parseFloat(porc).toFixed(2)+' %')
                }else{
                    svg.append('text')
                        .attr('class','porcentaje')
                        .attr("font-size",14)
                        .style("fill","red")
                        .attr("x", d3.select(this).attr('cx')+65)
                        .attr("y", d3.select(this).attr('cy')-50)
                        .text(Number.parseFloat(porc).toFixed(2)+' %')
                    }
    }}
                
    // DEJA LA GRAFICA COMO AL INICIO, CUANDO ACABA LA INTERACTIVIDAD

    function mouseOut() {
        d3.select(this)
            .transition()
            .duration(300)
            .style("fill",d3.select(this).style("fill"))
            .attr("stroke","none")
            .attr("r",3.8)

            // ELIMINA LO ANADIDO CON EL MOUSEON

            d3.select('.texto_valor').remove();
            d3.select('.porcentaje').remove();
            d3.select(".datosrectangulo").remove();
    }
    });
} //end of the function
