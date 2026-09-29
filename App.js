import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { iniciarBanco } from './src/db';
import CadastroScreen from './src/CadastroScreen';
import JogoScreen from './src/JogoScreen';
import RankingScreen from './src/RankingScreen';

iniciarBanco();

const ABAS = [
  { id: 'cadastro', titulo: 'Figuras' },
  { id: 'jogo', titulo: 'Jogar' },
  { id: 'ranking', titulo: 'Ranking' },
];

export default function App() {
  const [tela, setTela] = useState('cadastro');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.titulo}>Jogo da Memória</Text>

      <View style={styles.abas}>
        {ABAS.map((aba) => (
          <TouchableOpacity
            key={aba.id}
            style={[styles.aba, tela === aba.id && styles.abaAtiva]}
            onPress={() => setTela(aba.id)}
          >
            <Text style={styles.abaTexto}>{aba.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.conteudo}>
        {tela === 'cadastro' && <CadastroScreen />}
        {tela === 'jogo' && <JogoScreen />}
        {tela === 'ranking' && <RankingScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 50,
  },
  titulo: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  abas: { flexDirection: 'row' },
  aba: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#2c5282' },
  abaAtiva: { backgroundColor: '#f6ad55' },
  abaTexto: { color: '#fff', fontWeight: 'bold' },
  conteudo: { flex: 1, backgroundColor: '#f7fafc' },
});
