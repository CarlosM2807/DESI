function draw_multiseries(s, w, h, series) {

    var margin = { top: 70, right: 20, bottom: 30, left: 50 },
        w = w - margin.left - margin.right,
        h = h - margin.top - margin.bottom;
    var parseDate = d3.timeParse("%d-%b-%y");  // Transforma array en objeto Date
    var x = d3.scaleTime().range([0, w]);
    var y = d3.scaleLinear().range([h, 0]);
    var color = d3.scaleOrdinal(d3.schemeCategory10); // Fijamos el rango de salida (paleta de colores)

    var xAxis = d3.axisBottom(x)
        .ticks(5);
    var yAxis = d3.axisLeft(y)
        .ticks(5);

    var xGrid = d3.axisBottom(x)
        .ticks(5)
        .tickSize(-h, 0, 0)
        .tickFormat("");
    var yGrid = d3.axisLeft(y)
        .ticks(5)
        .tickSize(-w, 0, 0)
        .tickFormat("");

    var svg = d3.select(s).append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // función line, genera las lineas en formato svg del grafico
    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.attendee); });

    d3.csv("data_02.csv").then(function (data) {
        data.forEach(function (d) {
            d.date = parseDate(d.date);
        });
        // color.domain(d3.keys(data[0]).filter(function (key) { // Para V5
        color.domain(Object.keys(data[0]).filter(function (key) {  // CAMBIADO EN V6
            return key !== "date";
        }));
        var continents = color.domain().map(function (name) {
            return {
                name: name,
                values: data.map(function (d) {
                    return { date: d.date, attendee: +d[name] };
                })
            };
        });

// Definimos los dominios de salida de cada dimension X e Y 
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([
            d3.min(continents, function (c) {
                return d3.min(c.values, function (v) { return v.attendee; });
            }),
            d3.max(continents, function (c) {
                return d3.max(c.values, function (v) { return v.attendee; });
            })
        ]);

// Dependiendo del valor del cuarto argumento pintaremos todas las lineas o las de un solo continente
// MODIFICADO EN V6 (es mas simple)
        if (series < 3) {
            continents = [continents[series]];
        } else {
            var tmp = [];
            tmp.push(continents[2]);
            tmp.push(continents[1]);
            tmp.push(continents[0]);
            continents = tmp;
        }

// Annadimos los elementos SVG que pintan el grafico (ejes, rejilla y lineas)
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + h + ")")
            .call(xAxis); // Eje X
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);  // EjeY

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0, " + h + ")")
            .call(xGrid);  // Rejilla horizontal
        svg.append("g")
            .attr("class", "grid")
            .call(yGrid);  // Rejilla vertical
        var continent = svg.selectAll(".continent")
            .data(continents)
            .enter().append("g")
            .attr("class", "continent");
        continent.append("path")
            .attr("class", "line")
            .attr("d", function (d) { return line(d.values); }) // Lineas del grafico
            .style("stroke", function (d) { return color(d.name); });  // Color de cada linea
        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0, " + i * 20 + ")"; }); // Ubicacion cada elemento de la leyenda
        legend.append("rect") 
            .attr("x", w - 18)
            .attr("y", 4)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color); // Cuadrado de color de la leyenda
        legend.append("text")
            .attr("x", w - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; }); // Texto de la leyenda
    })
        .catch(function (error) {
            console.log(`Error al cargar los datos: ${error.message}`);
        });

// Parte que annade los titulos de ejes y grafico
    var labels = svg.append("g")
        .attr("class", "labels");
    labels.append("text")
        .attr("transform", "translate(0, " + h + ")")
        .attr("x", (w - margin.right))
        .attr("dx", "-1.0em")
        .attr("dy", "2.0em")
        .text("[Months]");
    labels.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Attendees");
    var title = svg.append("g")
        .attr("class", "title");
    title.append("text")
        .attr("x", (w / 2))
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "22px")
        .text("A multiseries line chart");
} //end of the function
