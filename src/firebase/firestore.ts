import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase.config";
import { type Voter } from "../../types/types";

interface UserData {
  name: string;
  email: string;
  uid: string;
}

interface ElectionData {
  name: string;
  date: string;
  status: string;
  createdBy: string;
  voters?: string[];
  aspirants?: Array<{ name: string; manifesto: string }>;
}

// Add a document to a collection
export const addUser = async (data: UserData, uid: string) => {
  await setDoc(doc(db, "users", uid), data);
};

// Get a document by ID from a collection
export const getDocumentById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const addElection = async (data: ElectionData) => {
  const colRef = collection(db, "elections");
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Get all elections created by a specific admin (by UID)
export const getElectionsByAdmin = async (adminUid: string) => {
  const colRef = collection(db, "elections");
  const q = query(colRef, where("createdBy", "==", adminUid), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Delete  election created by a specific admin (by UID)
export const deleteElection = async (electionId: string) => {
  const docRef = doc(db, "elections", electionId);
  await deleteDoc(docRef);
};

// Close  election created by a specific admin (by UID)
export const closeElection = async (electionId: string) => {
  const docRef = doc(db, "elections", electionId);
  await updateDoc(docRef, { status: "Completed" });
};

// get election by ID
export const getElectionById = async (electionId: string) => {
  const docRef = doc(db, "elections", electionId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// Close  election created by a specific admin (by UID)
export const updateElection = async (
  electionId: string,
  data: Partial<ElectionData>
) => {
  const docRef = doc(db, "elections", electionId);
  await updateDoc(docRef, data);
};

// Add a voter to an election
export const addVoterToElection = async (electionId: string, voter: Voter) => {
  const votersRef = collection(doc(db, "elections", electionId), "voters");
  await addDoc(votersRef, { ...voter, isVerified: false });
};

// Verify a voter's identity
export const verifyVoter = async (electionId: string, voterId: string) => {
  const voterDocRef = doc(db, "elections", electionId, "voters", voterId);
  await updateDoc(voterDocRef, { isVerified: true });
};

// get all voters for an election
export const getVotersForElection = async (electionId: string) => {
  const votersRef = collection(doc(db, "elections", electionId), "voters");
  const snapshot = await getDocs(votersRef);
  return snapshot.docs.map((doc) => ({ voterId: doc.id, ...doc.data() }));
};

// Delete a voter from an election
export const deleteVoterFromElection = async (
  electionId: string,
  voterId: string
) => {
  const voterDocRef = doc(db, "elections", electionId, "voters", voterId);
  await deleteDoc(voterDocRef);
};

// Add a position to an election
export const addPositionToElection = async (
  electionId: string,
  position: string
) => {
  const positionsRef = collection(
    doc(db, "elections", electionId),
    "positions"
  );
  await addDoc(positionsRef, {
    position,
    aspirants: [], // Initialize with an empty array for aspirants
  });
};

// Get all positions for an election
export const getPositionsForElection = async (electionId: string) => {
  const positionsRef = collection(
    doc(db, "elections", electionId),
    "positions"
  );
  const snapshot = await getDocs(positionsRef);
  return snapshot.docs.map((doc) => ({ positionId: doc.id, ...doc.data() }));
};

// Delete a position from an election
export const deletePositionFromElection = async (
  electionId: string,
  positionId: string
) => {
  const positionDocRef = doc(
    db,
    "elections",
    electionId,
    "positions",
    positionId
  );
  await deleteDoc(positionDocRef);
};

// Add a voter to an election
export const addAspirantToPosition = async (
  electionId: string,
  positionId: string,
  aspirant: any
) => {
  const aspirantsRef = collection(
    doc(db, "elections", electionId),
    "positions",
    positionId,
    "aspirants"
  );
  await addDoc(aspirantsRef, aspirant);
};

// Get all aspirants for a position in an election
export const getAspirantsForPosition = async (
  electionId: string,
  positionId: string
) => {
  const aspirantsRef = collection(
    doc(db, "elections", electionId),
    "positions",
    positionId,
    "aspirants"
  );
  const snapshot = await getDocs(aspirantsRef);
  return snapshot.docs.map((doc) => ({ aspirantId: doc.id, ...doc.data() }));
};

// Delete an aspirant from a position in an election
export const deleteAspirantFromPosition = async (
  electionId: string,
  positionId: string,
  aspirantId: string
) => {
  const aspirantDocRef = doc(
    db,
    "elections",
    electionId,
    "positions",
    positionId,
    "aspirants",
    aspirantId
  );
  await deleteDoc(aspirantDocRef);
};

export const submitVote = async (
  electionId: string,
  voteData: { [positionId: string]: string },
  uniqueField: string // Optional, if you want to track who voted
) => {
  const votesRef = collection(doc(db, "elections", electionId), "votes");
  await addDoc(votesRef, {
    selections: voteData,
    uniqueField: uniqueField,
    timestamp: new Date(),
  });
};
