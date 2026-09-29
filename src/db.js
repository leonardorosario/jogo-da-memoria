import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('jogomemoria.db');

export function iniciarBanco() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS figuras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagem TEXT NOT NULL,
      descricao TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS recordes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jogador TEXT NOT NULL,
      pontuacao INTEGER NOT NULL,
      data TEXT NOT NULL
    );
  `);
}

export function listarFiguras() {
  return db.getAllSync('SELECT * FROM figuras ORDER BY id DESC');
}

export function inserirFigura(imagem, descricao) {
  db.runSync('INSERT INTO figuras (imagem, descricao) VALUES (?, ?)', imagem, descricao);
}

export function excluirFigura(id) {
  db.runSync('DELETE FROM figuras WHERE id = ?', id);
}

export function listarTop5() {
  return db.getAllSync('SELECT * FROM recordes ORDER BY pontuacao DESC, id ASC LIMIT 5');
}

export function inserirRecorde(jogador, pontuacao, data) {
  db.runSync('INSERT INTO recordes (jogador, pontuacao, data) VALUES (?, ?, ?)', jogador, pontuacao, data);
}
