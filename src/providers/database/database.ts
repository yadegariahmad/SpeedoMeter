import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider
{
  _DB: SQLiteObject;

  constructor(private _SQL: SQLite, private _PLAT: Platform)
  {
    this._PLAT.ready()
      .then(() =>
      {
        this.createDatabaseAndTable();
      });
  }

  createDatabaseAndTable()
  {
    this._SQL.create({
      name: 'speedometer.db',
      location: 'default'
    })
      .then((db: SQLiteObject) =>
      {
        this._DB = db;
        this._DB.executeSql(`CREATE TABLE IF NOT EXISTS history
          (
            s_lon real not null,
            s_lat real not null,
            d_lon real not null,
            d_lat real not null,
            _time real,
            distance real
          )`, [])
          .then(() =>
          {
            console.log('The table history was successfully created');
          })
          .catch((e) =>
          {
            console.log('error create table: ', e);
          });

      })
      .catch((e) =>
      {
        console.log('error create database: ', e);
      });
  }

  retrieveRecords(): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      this._DB.executeSql('SELECT * FROM history', [])
        .then((data: any) =>
        {
          let items: any[] = [];
          if (data.rows.length > 0)
          {
            let k;

            // iterate through returned records and push as nested objects into
            // the items array
            for (k = 0; k < data.rows.length; k++)
            {
              let item = data.rows.item(k);
              items.push(
                {
                  s_lon: item.s_lon,
                  s_lat: item.s_lat,
                  d_lon: item.d_lon,
                  d_lat: item.d_lat,
                  time: item._time,
                  distance: item.distance
                });
            }
          }
          resolve(items);
        })
        .catch((error) =>
        {
          reject(error);
        });
    });
  }

  addRecord(s_lon: number, s_lat: number, d_lon: number, d_lat: number, time: number, distance: number): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      let sql = `INSERT INTO history(s_lon, s_lat, d_lon, d_lat, _time, distance)
        VALUES(${s_lon}, ${s_lat}, ${d_lon}, ${d_lat}, ${time}, ${distance})`;
        
      this._DB.executeSql(sql, [])
        .then(() =>
        {
          resolve(true);
        })
        .catch((error: any) =>
        {
          reject(error);
        });
    });
  }

}
