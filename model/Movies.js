const db = require("../helper/db_connection");
const fs = require("fs");

module.exports = {
  get: (req, res) => {
    return new Promise((resolve, reject) => {
      const offset = (req.query.page - 1) * req.query.limit;
      const sql = `SELECT * FROM movies
      LEFT JOIN categories on movies.categoryID = categories.categoryID
      ORDER BY created_at ASC
      LIMIT ${req.query.limit} 
      OFFSET ${offset}`;
      // let category = "";

      db.query(sql, (err, results) => {
        if (err) {
          console.log(err)
          reject({
            message: "Something wrong",
          });
        }
        // for (i = 0; i < results.length; i++) {
        //   let category1 = "";
        //   var categoryName = "";
        //   let result5 = "";

        //   category1 = results[i]["categoryID"];
        //   category = category1.split(",");
        //   let result3 = category.map(function (x) {
        //     return parseInt(x, 10);
        //   });
        //   console.log(result3)

        //   for (k = 0; k < result3.length; k++) {
        //     for (m = 0; m < result3[k].length; m++) {
        //       const sql3 = `SELECT * FROM categories where categoryID=${result3[m]}`;
        //       db.query(sql3, (err3, result4) => {
        //         //result5 = categoryName.concat(result4[m]["categoryName"]);
        //         console.log(result4[m]);
        //       });
        //     }
        //   }

        //   // console.log(categoryName)
        //   results[i]["allCategoryName"] = result5;
        // }
        resolve({
          message: "Get all from movies success",
          status: 200,
          data: results,
        });
      });
    });
  },
  add: (req, res) => {
    return new Promise((resolve, reject) => {
      const {
        title,
        categoryID,
        durationHours,
        durationMinute,
        director,
        releaseDate,
        cast,
        description,
        cover,
      } = req.body;

      const sql = `INSERT INTO movies(title, categoryID, durationHours, durationMinute, director, releaseDate, cast, description, cover) VALUES('${title}','${categoryID}','${durationHours}','${durationMinute}','${director}','${releaseDate}','${cast}', '${description}', '${cover}')`;

      db.query(sql, (err, results) => {
        if (err) {
          console.log(err);
          reject({ message: "ada error" });
        }
        resolve({
          message: "Add new movies success",
          status: 201,
          data: {
            id: results.insertId,
            ...req.body,
          },
        });
      });
    });
  },
  update: (req, res) => {
    return new Promise((resolve, reject) => {
      const { movieID } = req.params;
      db.query(
        `SELECT * FROM movies where movieID=${movieID}`,
        (err, results) => {
          if (err) {
            res.send({ message: "ada error" });
          }

          const previousData = {
            ...results[0],
            ...req.body,
          };
          
          const {
            title,
            categoryID,
            durationHours,
            durationMinute,
            director,
            releaseDate,
            cast,
            description,
            cover,
          } = previousData;

          const tempImg = results[0].cover;
          if (req.body.cover) {
            fs.unlink(`uploads/${tempImg}`, function (err) {
              if (err) {
                console.log(err);
                reject({
                  message: "Something wrong",
                });
              }
            });
          }

          db.query(
            `UPDATE movies SET title='${title}', categoryID='${categoryID}', durationHours='${durationHours}', durationMinute='${durationMinute}', director='${director}', releaseDate='${releaseDate}', cast='${cast}', description='${description}', cover='${cover}' WHERE movieID='${movieID}'`,
            (err, results) => {
              if (err) {
                console.log(err);
                reject({ message: "Something wrong" });
              }
              resolve({
                message: "Update movies success",
                status: 201,
                data: results,
                changed: { ...req.body }
              });
            }
          );
        }
      );
    });
  },
  remove: (req, res) => {
    return new Promise((resolve, reject) => {
      const { movieID } = req.params;
      db.query(
        `SELECT cover FROM movies WHERE movieID=${movieID}`,
        (err, results) => {
          if (!results.length) {
            reject({
              message: "Data id not found",
            });
          } else {
            const tempImg = results[0].cover;
            db.query(
              `DELETE FROM movies WHERE movieID=${movieID}`,
              (err, results) => {
                if (err) {
                  console.log(err);
                  reject({ message: "Something wrong" });
                }
                fs.unlink(`uploads/${tempImg}`, function (err) {
                  if (err) {
                    resolve({
                      message: "Delete movies success",
                      status: 201,
                      data: results,
                    });
                  }
                  resolve({
                    message: "Delete movies success",
                    status: 201,
                    data: results,
                  });
                });
              }
            );
          }
        }
      );
    });
  },
};
