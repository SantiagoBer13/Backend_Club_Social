import  { pool }  from "../db.js"

export const getNews = async (req, res) => {
    try {
      //const page = parseInt(req.query.page) || 1;
      const { page = 1, nameFilter = '' } = req.query;
      console.log(nameFilter)
      const startIndex = (page - 1) * 9;
      const [rows] = await pool.query(
        `SELECT n.id, n.title, n.dateNew, n.description, c.name AS category, n.img FROM news n 
          INNER JOIN category c ON c.id = n.idCategory 
          WHERE n.title LIKE ?
          ORDER BY n.id
          LIMIT ?, 9
        `, [`%${nameFilter}%`, startIndex]
      );

      const [numEvents] = await pool.query(
        `SELECT n.id, n.title, n.dateNew, n.description, c.name AS category, n.img FROM news n 
          INNER JOIN category c ON c.id = n.idCategory 
          WHERE n.title LIKE ?
        `, [`%${nameFilter}%`]
      );

      const pages = Math.ceil( parseInt(numEvents.length) / 9)
        console.log(pages)
      return res.json({"events": rows, "pages": pages})
      //return res.json(rows);
    } catch (error) {
      return res.status(500).send({ message: "Error al obtener noticias.", e: error.message});
    }
  };

export const getNew = async (req, res) => {
    try {
        const id = req.params.id
        
        const [rows] = await pool.query(
            "SELECT n.id, n.title, n.dateNew, n.description, c.name as category,n.img FROM news n"+
        " INNER JOIN category c ON c.id = n.idCategory WHERE n.id = ?",[id])
        if(rows.length <= 0) return res.status(404).json({
            message: "Noticia no encontrada."
        })
        return res.send(rows[0])
    } catch (error) {
        return res.status(500).send({message: "Error al obtener la noticia."});
    }
}

