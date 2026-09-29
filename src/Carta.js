import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';

// Carta com animação de virar (rotação no eixo Y)
export default function Carta({ imagem, aberta, acertada, onPress }) {
  const giro = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  // 3 cartas por linha: largura da tela - padding da tela (24) - margens das cartas (3 x 8)
  const tamanho = Math.floor((width - 24 - 24) / 3);

  useEffect(() => {
    Animated.timing(giro, {
      toValue: aberta ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [aberta]);

  const rotacaoVerso = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const rotacaoFrente = giro.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <TouchableOpacity style={[styles.container, { width: tamanho, height: tamanho }]} onPress={onPress} activeOpacity={0.8}>
      {/* verso (carta fechada) */}
      <Animated.View style={[styles.face, styles.verso, { transform: [{ rotateY: rotacaoVerso }] }]}>
        <Text style={styles.interrogacao}>?</Text>
      </Animated.View>
      {/* frente (imagem) */}
      <Animated.View
        style={[styles.face, acertada && styles.acertada, { transform: [{ rotateY: rotacaoFrente }] }]}
      >
        <Image source={{ uri: imagem }} style={styles.imagem} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { margin: 4 },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#2c5282',
  },
  verso: { backgroundColor: '#2c5282', alignItems: 'center', justifyContent: 'center' },
  interrogacao: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  acertada: { borderColor: '#38a169' },
  imagem: { width: '100%', height: '100%' },
});
