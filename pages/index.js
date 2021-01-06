import { useRef } from "react";
import useSWR, { mutate } from "swr";
import { useUser } from "../components/UserContext";
import { supabase } from "../utils/initSupabase";
import SupabaseAuth from "../components/SupabaseAuth";

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const fetcherPost = (url, token, payload) =>
  fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());

const Index = () => {
  const { user, session } = useUser();
  const { data, error } = useSWR(
    session ? ["/api/beers", session.access_token] : null,
    fetcher
  );
  const nameBeerRef = useRef();

  const handleNewBeer = async () => {
    mutate(["/api/beers", session.access_token], async (beers) => {
      const beer = await fetcherPost(
        "/api/beers",
        session ? session.access_token : null,
        {
          name: nameBeerRef.current.value,
        }
      );
      return [...beers, beer];
    });
  };

  if (!user) {
    return (
      <>
        <p>Hi there!</p>
        <p>You are not signed in.</p>
        <div>
          <SupabaseAuth />
        </div>
      </>
    );
  }

  return (
    <div>
      <p
        style={{
          display: "inline-block",
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => supabase.auth.signOut()}
      >
        Log out
      </p>
      <div>
        <p>You're signed in. Email: {user.email}</p>
      </div>
      {error && <div>Failed to fetch user!</div>}
      {data && !error ? (
        <div>
          <span>Beers:</span>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div>
        <input type="text" placeholder="name" ref={nameBeerRef} />
        <button onClick={handleNewBeer}>New beer</button>
      </div>
    </div>
  );
};

export default Index;
