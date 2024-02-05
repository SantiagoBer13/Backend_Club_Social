import  { pool }  from "../db.js"

export const getNews = async (req, res) => {
    try {
      //const page = parseInt(req.query.page) || 1;
      const { page = 1, nameFilter = '' } = req.query;
      const startIndex = (page - 1) * 9;
      const [rows] = await pool.query(
        `SELECT n.id, n.title, n.dateNew, n.description, c.name AS category, n.img FROM news n 
          INNER JOIN category c ON c.id = n.idCategory 
          WHERE n.title LIKE ?
          ORDER BY n.id
          LIMIT ?, 9
        `, [`%${nameFilter}%`, startIndex]
      );

      const [numNews] = await pool.query(
        `SELECT * FROM news n 
          WHERE title LIKE ?
        `, [`%${nameFilter}%`]
      );
      const pages = Math.ceil( parseInt(numNews.length) / 9)
      return res.json({"news": rows, "pages": pages})
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

export const createNew = async(req, res) => {
  try {
    const { title, date_new, description, id_category, img } = req.body
    const [create] = await pool.query(`
    INSERT INTO news (title, dateNew, description, idCategory, img)
    VALUES(?,?,?,?,?)
      `,[title, date_new, description, id_category, img])
      if(create.affectedRows > 0){
        const [news] = await pool.query("SELECT n.id, n.title, n.dateNew, n.description, c.name as category,n.img FROM news n"+
        " INNER JOIN category c ON c.id = n.idCategory WHERE n.id = ?", [create.insertId]);        
        return res.status(201).json({
          message: "New Created",
          event: news[0]
        })
      }
  } catch (error) {
    return res.status(500).send({ message: "Algo fue mal", messageError:  error});
  }
}

export const updateNew = async (req, res) => {
  try {
    const { title, date_new, description, id_category, img, new_id } = req.body
    const [result] = await pool.query(`
    UPDATE news
      SET title = IFNULL(?, title), 
          dateNew = IFNULL(?, dateNew), 
          description = IFNULL(?, description), 
          idCategory = IFNULL(?, idCategory), 
          img = IFNULL(?, img)
      WHERE id = ?
    `,[title, date_new, description, id_category, img, new_id ])
    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "New not founds" });
    }
    const [news] = await pool.query("SELECT n.id, n.title, n.dateNew, n.description, c.name as category,n.img FROM news n"+
      " INNER JOIN category c ON c.id = n.idCategory WHERE n.id = ?", [new_id]);        
      return res.status(201).json({
      message: "New Updated",
      event: news[0]
    })
  } catch (error) {
    return res.status(500).send({ message: "Algo fue mal", messageError:  error});
  }
}

export const deleteNew = async (req, res) => {
  try {
    const { new_id } = req.body;
    const [deleted] = await pool.query("DELETE FROM news WHERE id = ?", [new_id])
    res.status(204).json({ message: "New Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error" });
  }
}
