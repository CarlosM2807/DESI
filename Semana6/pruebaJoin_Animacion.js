function pruebaJoin() {

  // Fijamos la duración de la animación. Está lenta para que se vea mejor el efecto
  const t = svg.transition()
    .duration(1500);

  svg.selectAll("text")
    .data(randomLetters(), d => d) // Funcion clave. Usamos como clave para asociar dato-elemento html el valor del dato 
    .join(
      enter => {enter.append("text")   // Añade los nuevos, que se muestran en color verde. Fijando sus posiciones en el eje X
                                      //de acuerdo al orden del elemento html asociado (i).
        .attr("fill", "green")
        .attr("x", (d, i) => i * 16) // La separacion entre letras es 16 pixeles
        .attr("y", -30)
        .text(d => d)
        .transition(t)
        .attr("y", 0);
        //.call(enter => enter.transition(t)  // Si se quitan los "{}" hay que llamar a transition() mediante este call
                                              //si no da un error al retornar un valor incorrecto. 
        //  .attr("y", 0)),
      },
      update => {update  // Se actualizan los ya existentes (los que permanecen en el nuevo array), 
                        //modificando a negro su color y fijando sus nuevas posiciones en X
        .attr("fill", "black")
        .attr("y", 0)
        .transition(t)
        .attr("x", (d, i) => i * 16);
        //.call(update => update.transition(t)
        //  .attr("x", (d, i) => i * 16)),
      },
      exit => {exit  // Se eliminan los elementos que estaban pero ya no están en el nuevo array.
        .attr("fill", "brown")
        .transition(t)
        .attr("y", 30)
        .remove();
        //.call(exit => exit.transition(t)
        //  .attr("y", 30)
        //  .remove())
      }
    );
}

// Funcion que genera un array de letras ordenadas aleatoriamente
function randomLetters() {
  return d3.shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
    .slice(0, Math.floor(6 + Math.random() * 20))
    .sort();
}