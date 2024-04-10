import { sign } from "jsonwebtoken";
import jwkToPem, { JWK } from "jwk-to-pem";

// generated from https://mkjwk.org/
export const keyPair = {
  keys: [
    {
      p: "5tp2kKLymZovVYiocHuXQPJuDhBj4akMfCr1CCbvKo_X284GwUgbq8YnF4QDKlVv6Ts7hiQPMQ9ia5aqHbpGla4qJpYYx5RCDy8d9IRk5pnplGhCiDYThG26HxCwpg2Cz0QZ94SkUeNdy8fg3zHL9tb2nfrl0q8Cv56uLWiCJqc",
      kty: "RSA",
      q: "rO_IsdDChTB4ROtzpOEDtMMSWpq4ewCyN-DtFyk9oQTZa1cHhu6QzkF0xT-zPcG0F1kqnNbyhaq6xm3joifOFOaGEdw-8v4Sy7ghbY2Gvv1OGvY0sMgE9EP4Y45n4pgmLRdP9y5wgjXm3YkxtJcQAQSBXeO0Y9GmguVmQtGeydk",
      d: "OMClD1MDNZ14CmlshVc_fn8qQpjwvuKjefINNgReXeHEFsfegX2EfP9Zg0vfcKjxYRktBL1bhvY4Q3zJMa7YMZoGv66kWVzVhRqCu11B_FafSDtwcqiB19VDEvyCapa7522BWSfWzz9p494XLsL9Pb1byIQiGK0ibscvfjTRnwWkkvo2YqeYABUl5fRKwpG0-xR2NT8fwDAr0c2O350E-QvKnfdDVPFeAOV4ITfh8MM65ZVEVbBQn7BqlP8BmEEdFEDnFtte6CVi5O56561WF0aqfa72AiQlYrZfeJM96ZI7ONxnD0ES4pgnrQ4aEicWeCrT9KKW039egocdww6GoQ",
      e: "AQAB",
      use: "sig",
      kid: "he-ZVkw5RGWRYXWi1Lu_uroh0InY6KBtHrxy5dsYwmE",
      qi: "SdgoGdN_v5twswiOfDL3vNAR0nfxRpHYOIRxyRWujg-iNtSNPNdgC5Or9QRMs3EYPZ_ZViQ2Q1KuOX2hXSIwipPgI4_19rlTaOILBSyVyGzmL-u9maclU0xz-_eTiPdufyVRpggWZNHZWYq1h_gUi6hc1p-EaJ2iAGc6Rzs1pFw",
      dp: "UPtmCEsBK50I6cpsvDi-0Iu6y7g4MZspxA0Vs-xkjduz72mQuRDglBuI7xjiO2GJRpn-wYm4wo8RCYjq2E7WH__ezXZt7uU1Xzo6GeKvuq1XYTZJ0JqXsicD2Y3zSe0HbEoJiei_8_H8n1XYrrM7R7YVAUpYgNXf8vRpSYiVz5U",
      alg: "RS256",
      dq: "Mp8-ME7bogE-M254u5riatdvV_ZSai8Z_CFrRYxc7fVtb25aVbUfzkB63gJ3hWxeOzdusdp5w4bmhY9FQwJD4PpZ5ICELL0S429S2a7D8sRTSLEpW1YxnQ8IdpwI7Nt80VYxojmF1ZfRrKesVSCjHqki9UjiVRXZmBduh8C0qoE",
      n: "m_MCmORxAv3DgNebsMhNAE7APSx-vgYURYc2-qDsrpM-zF7FeQM4Sxdyr7R2uJTrpjUXJBzE8kIRlCiUtd-EsghKS8CV195Ts315zib_3eqHRqLGH-k09sfkyCiWsTSDym6m379A7e0_5qsK-qKNTpPXclBGCSML_9h7MgtKQSFzxGUZllAZ6j7n9oxdvOnemNClkY6qaTZ4eUvmZNjXlPVTh2WrM9N4yZVj42uP1WtxRXb3XmiA6HO72rWJARZgZ17JhX8j_ktxKGUOiqgFjpiAQGfDQU_fv1Oat9sDXTV0x7EeKRb0jdOSz22MFJvqdB3X11-qTJrE8457-L3ijw",
    },
  ],
};

export function GenerateToken() {
  const privateKey = jwkToPem(keyPair.keys[0] as JWK, { private: true });
  const token = sign({}, privateKey, {
    algorithm: "RS256",
    keyid: keyPair.keys[0].kid,
  });

  return token;
}
