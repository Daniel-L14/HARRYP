import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated
} from "react-native";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [characters, setCharacters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [screen]);

  const loadCharacters = () => {
    setLoading(true);
    fetch("https://api.potterdb.com/v1/characters")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.data);
        setFiltered(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const searchCharacter = (text) => {
    setSearch(text);
    const result = characters.filter((item) =>
      item.attributes.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(result);
  };

  const toggleFavorite = (item) => {
    const exists = favorites.find((f) => f.id === item.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== item.id));
    } else {
      setFavorites([...favorites, item]);
    }
  };

  const renderItem = ({ item }) => {
    const isFav = favorites.find((f) => f.id === item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelected(item);
          setScreen("detail");
        }}
      >
        {item.attributes.image && (
          <Image source={{ uri: item.attributes.image }} style={styles.image} />
        )}
        <Text style={styles.name}>{item.attributes.name}</Text>
        <Text style={styles.house}>
          {item.attributes.house || "Sin casa"}
        </Text>

        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Text style={{ fontSize: 20 }}>
            {isFav ? "❤️" : "🤍"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (screen === "menu") {
    return (
      <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>⚡ Harry Potter App</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            loadCharacters();
            setScreen("list");
          }}
        >
          <Text style={styles.buttonText}>Ver Personajes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen("favorites")}
        >
          <Text style={styles.buttonText}>Favoritos</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (screen === "list") {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Personajes</Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar personaje..."
          value={search}
          onChangeText={searchCharacter}
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("menu")}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (screen === "detail" && selected) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {selected.attributes.image && (
          <Image
            source={{ uri: selected.attributes.image }}
            style={styles.detailImage}
          />
        )}

        <Text style={styles.name}>{selected.attributes.name}</Text>
        <Text style={styles.house}>
          Casa: {selected.attributes.house || "Sin casa"}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleFavorite(selected)}
        >
          <Text style={styles.buttonText}>❤️ Favorito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("list")}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (screen === "favorites") {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Favoritos ❤️</Text>

        {favorites.length === 0 ? (
          <Text style={{ color: "white" }}>No hay favoritos</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setScreen("menu")}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a"
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a"
  },
  title: {
    fontSize: 26,
    color: "#facc15",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200
  },
  backButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  detailImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold"
  },
  house: {
    color: "#94a3b8"
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  }
});