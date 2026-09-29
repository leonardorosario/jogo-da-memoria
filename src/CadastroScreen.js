import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { listarFiguras, inserirFigura, excluirFigura } from './db';

export default function CadastroScreen() {
  const [figuras, setFiguras] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    setFiguras(listarFiguras());
  }

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true, // guardamos a imagem no banco para não depender de arquivos temporários
    });
    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      setImagem(`data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`);
    }
  }

  function salvar() {
    if (!imagem) {
      Alert.alert('Atenção', 'Selecione uma imagem.');
      return;
    }
    if (descricao.trim() === '') {
      Alert.alert('Atenção', 'Informe a descrição.');
      return;
    }
    inserirFigura(imagem, descricao.trim());
    setImagem(null);
    setDescricao('');
    carregar();
  }

  function excluir(figura) {
    Alert.alert('Excluir', `Deseja excluir "${figura.descricao}"?`, [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          excluirFigura(figura.id);
          carregar();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity style={styles.seletor} onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.preview} />
          ) : (
            <Text style={styles.seletorTexto}>Toque para escolher imagem</Text>
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TouchableOpacity style={styles.botao} onPress={salvar}>
            <Text style={styles.botaoTexto}>Salvar figura</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitulo}>Figuras cadastradas: {figuras.length}</Text>

      <FlatList
        data={figuras}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma figura cadastrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imagem }} style={styles.itemImagem} />
            <Text style={styles.itemTexto}>{item.descricao}</Text>
            <TouchableOpacity style={styles.excluir} onPress={() => excluir(item)}>
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  form: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  seletor: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#2c5282',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  seletorTexto: { textAlign: 'center', color: '#2c5282', fontSize: 12, padding: 4 },
  preview: { width: '100%', height: '100%' },
  input: { borderWidth: 1, borderColor: '#cbd5e0', borderRadius: 6, padding: 10, backgroundColor: '#fff' },
  botao: { backgroundColor: '#2c5282', padding: 12, borderRadius: 6, marginTop: 8, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  subtitulo: { fontWeight: 'bold', marginBottom: 6 },
  vazio: { textAlign: 'center', color: '#718096', marginTop: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemImagem: { width: 56, height: 56, borderRadius: 6 },
  itemTexto: { flex: 1, marginLeft: 10, fontSize: 16 },
  excluir: { backgroundColor: '#e53e3e', padding: 8, borderRadius: 6 },
});
