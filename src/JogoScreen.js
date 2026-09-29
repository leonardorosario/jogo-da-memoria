import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { listarFiguras, inserirRecorde } from './db';
import Carta from './Carta';

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function formatarTempo(segundos) {
  const m = String(Math.floor(segundos / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function calcularPontuacao(erros, segundos) {
  return Math.max(0, 100 - erros * 5 - Math.floor(segundos / 5));
}

export default function JogoScreen() {
  const [cartas, setCartas] = useState([]);
  const [abertas, setAbertas] = useState([]); 
  const [acertadas, setAcertadas] = useState([]);
  const [erros, setErros] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [jogando, setJogando] = useState(false);
  const [fim, setFim] = useState(false);
  const [jogador, setJogador] = useState('');
  const [recordeSalvo, setRecordeSalvo] = useState(false);

  useEffect(() => {
    if (!jogando || fim) return;
    const intervalo = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, [jogando, fim]);

  function iniciar() {
    const figuras = listarFiguras();
    if (figuras.length < 6) {
      Alert.alert('Atenção', 'Cadastre pelo menos 6 figuras para jogar.');
      return;
    }
    const escolhidas = embaralhar(figuras).slice(0, 6);
    const pares = escolhidas.flatMap((f) => [
      { chave: `${f.id}-a`, figuraId: f.id, imagem: f.imagem },
      { chave: `${f.id}-b`, figuraId: f.id, imagem: f.imagem },
    ]);
    setCartas(embaralhar(pares));
    setAbertas([]);
    setAcertadas([]);
    setErros(0);
    setSegundos(0);
    setBloqueado(false);
    setFim(false);
    setJogador('');
    setRecordeSalvo(false);
    setJogando(true);
  }

  function tocarCarta(indice) {
    const carta = cartas[indice];
    if (bloqueado || fim || abertas.includes(indice) || acertadas.includes(carta.figuraId)) return;

    const novasAbertas = [...abertas, indice];
    setAbertas(novasAbertas);
    if (novasAbertas.length < 2) return;

    const [a, b] = novasAbertas;
    if (cartas[a].figuraId === cartas[b].figuraId) {
      const novasAcertadas = [...acertadas, carta.figuraId];
      setAcertadas(novasAcertadas);
      setAbertas([]);
      if (novasAcertadas.length === 6) setFim(true);
    } else {
      setErros((e) => e + 1);
      setBloqueado(true);
      setTimeout(() => {
        setAbertas([]);
        setBloqueado(false);
      }, 1000);
    }
  }

  function salvarRecorde() {
    if (jogador.trim() === '') {
      Alert.alert('Atenção', 'Informe o nome do jogador.');
      return;
    }
    const data = new Date().toLocaleDateString('pt-BR');
    inserirRecorde(jogador.trim(), calcularPontuacao(erros, segundos), data);
    setRecordeSalvo(true);
  }

  if (!jogando) {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>Encontre os 6 pares com o menor número de erros!</Text>
        <TouchableOpacity style={styles.botao} onPress={iniciar}>
          <Text style={styles.botaoTexto}>Iniciar partida</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.placar}>
        <Text style={styles.placarTexto}>Erros: {erros}</Text>
        <Text style={styles.placarTexto}>Tempo: {formatarTempo(segundos)}</Text>
      </View>

      <View style={styles.grade}>
        {cartas.map((carta, indice) => (
          <Carta
            key={carta.chave}
            imagem={carta.imagem}
            aberta={abertas.includes(indice) || acertadas.includes(carta.figuraId)}
            acertada={acertadas.includes(carta.figuraId)}
            onPress={() => tocarCarta(indice)}
          />
        ))}
      </View>

      {fim && (
        <View style={styles.resultado}>
          <Text style={styles.parabens}>Parabéns! Você concluiu o jogo!</Text>
          <Text style={styles.texto}>Total de erros: {erros}</Text>
          <Text style={styles.texto}>Tempo: {formatarTempo(segundos)}</Text>
          <Text style={styles.texto}>Pontuação: {calcularPontuacao(erros, segundos)}</Text>

          {recordeSalvo ? (
            <Text style={styles.texto}>Recorde salvo!</Text>
          ) : (
            <View style={styles.linha}>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                value={jogador}
                onChangeText={setJogador}
              />
              <TouchableOpacity style={styles.botaoPequeno} onPress={salvarRecorde}>
                <Text style={styles.botaoTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.botao} onPress={iniciar}>
        <Text style={styles.botaoTexto}>{fim ? 'Jogar novamente' : 'Reiniciar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  placar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  placarTexto: { fontSize: 18, fontWeight: 'bold', color: '#2c5282' },
  grade: { flexDirection: 'row', flexWrap: 'wrap' },
  resultado: {
    backgroundColor: '#c6f6d5',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  parabens: { fontSize: 20, fontWeight: 'bold', color: '#276749', marginBottom: 6 },
  texto: { fontSize: 16, textAlign: 'center', marginVertical: 2 },
  linha: { flexDirection: 'row', marginTop: 8, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#fff',
  },
  botao: { backgroundColor: '#2c5282', padding: 14, borderRadius: 8, marginTop: 14, alignItems: 'center' },
  botaoPequeno: { backgroundColor: '#2c5282', padding: 10, borderRadius: 6, justifyContent: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
