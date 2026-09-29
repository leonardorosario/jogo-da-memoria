import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { listarTop5 } from './db';

export default function RankingScreen() {
  const [recordes, setRecordes] = useState([]);

  useEffect(() => {
    setRecordes(listarTop5());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Top 5 Recordes</Text>

      <View style={[styles.linha, styles.cabecalho]}>
        <Text style={[styles.col, styles.pos, styles.negrito]}>#</Text>
        <Text style={[styles.col, styles.negrito]}>Jogador</Text>
        <Text style={[styles.col, styles.negrito]}>Pontuação</Text>
        <Text style={[styles.col, styles.negrito]}>Data</Text>
      </View>

      {recordes.length === 0 && <Text style={styles.vazio}>Nenhum recorde ainda.</Text>}

      {recordes.map((r, i) => (
        <View key={r.id} style={styles.linha}>
          <Text style={[styles.col, styles.pos]}>{i + 1}</Text>
          <Text style={styles.col}>{r.jogador}</Text>
          <Text style={styles.col}>{r.pontuacao}</Text>
          <Text style={styles.col}>{r.data}</Text>
        </View>
      ))}

      <Text style={styles.info}>Pontuação = 100 − 5 por erro − 1 a cada 5 segundos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  linha: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  cabecalho: { backgroundColor: '#f6ad55' },
  col: { flex: 1 },
  pos: { flex: 0.3 },
  negrito: { fontWeight: 'bold' },
  vazio: { textAlign: 'center', color: '#718096', marginTop: 20 },
  info: { textAlign: 'center', color: '#718096', marginTop: 16, fontSize: 12 },
});
