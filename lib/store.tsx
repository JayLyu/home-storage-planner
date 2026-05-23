"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { calculateAssessment, generateQuickInventory } from "./calculate";
import { getCategoryById, migrateLegacyInventory } from "./categories";
import type {
  AssessmentInput,
  AssessmentResult,
  HouseholdInfo,
  InventoryMode,
  LifestyleProfile,
  NewHomeInfo,
  OldHomeInfo,
  WizardStepId,
} from "./types";

const STORAGE_KEY = "home-storage-planner-assessment";

const defaultHousehold: HouseholdInfo = {
  householdSize: 2,
  hasChildren: false,
  plansForChildren: false,
  hasPets: false,
  worksFromHome: false,
  expectedHouseholdGrowth: "无",
  timeHorizon: "3年",
};

const defaultOldHome: OldHomeInfo = {
  oldHomeArea: 80,
  oldHomeLayout: "两居",
  oldStorageSatisfaction: "不足",
  overflowZones: [],
  temporaryStorageZones: [],
  currentCabinetTypes: [],
  currentCabinetLength: 4,
  declutterIntent: 3,
  declutterRatio: 15,
};

const defaultNewHome: NewHomeInfo = {
  newHomeArea: 95,
  newHomeLayout: "两居",
  hasStorageRoom: false,
  plannedCabinetZones: ["玄关柜", "衣柜", "厨房高柜"],
  flexibleZones: [],
  storagePriority: "均衡",
  cabinetDepthPreference: "标准柜",
};

const defaultLifestyle: LifestyleProfile = {
  stockpilingLevel: 3,
  minimalismLevel: 3,
  cookingFrequency: 3,
  travelFrequency: 2,
  digitalDeviceLevel: 3,
  hobbyStorageLevel: 2,
  seasonalClothingLevel: 3,
};

interface AssessmentContextValue {
  step: WizardStepId;
  setStep: (step: WizardStepId) => void;
  household: HouseholdInfo;
  setHousehold: (data: Partial<HouseholdInfo>) => void;
  oldHome: OldHomeInfo;
  setOldHome: (data: Partial<OldHomeInfo>) => void;
  newHome: NewHomeInfo;
  setNewHome: (data: Partial<NewHomeInfo>) => void;
  lifestyle: LifestyleProfile;
  setLifestyle: (data: Partial<LifestyleProfile>) => void;
  inventoryMode: InventoryMode;
  setInventoryMode: (mode: InventoryMode) => void;
  inventory: { categoryId: string; quantity: number; unit: string }[];
  setInventoryItem: (categoryId: string, quantity: number) => void;
  result: AssessmentResult | null;
  computeResult: () => AssessmentResult;
  reset: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

type SavedState = {
  step?: WizardStepId;
  household?: HouseholdInfo;
  oldHome?: OldHomeInfo;
  newHome?: NewHomeInfo;
  lifestyle?: LifestyleProfile;
  inventoryMode?: InventoryMode;
  inventory?: { categoryId: string; quantity: number; unit: string }[];
};

function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<WizardStepId>("household");
  const [household, setHouseholdState] = useState<HouseholdInfo>(defaultHousehold);
  const [oldHome, setOldHomeState] = useState<OldHomeInfo>(defaultOldHome);
  const [newHome, setNewHomeState] = useState<NewHomeInfo>(defaultNewHome);
  const [lifestyle, setLifestyleState] = useState<LifestyleProfile>(defaultLifestyle);
  const [inventoryMode, setInventoryMode] = useState<InventoryMode>("quick");
  const [inventory, setInventory] = useState<{ categoryId: string; quantity: number; unit: string }[]>([]);
  const [ready, setReady] = useState(false);
  const skipSaveRef = useRef(true);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setStep(saved.step ?? "household");
      setHouseholdState(saved.household ?? defaultHousehold);
      setOldHomeState(saved.oldHome ?? defaultOldHome);
      setNewHomeState(saved.newHome ?? defaultNewHome);
      setLifestyleState(saved.lifestyle ?? defaultLifestyle);
      setInventoryMode(saved.inventoryMode ?? "quick");
      setInventory(migrateLegacyInventory(saved.inventory ?? []));
    }
    skipSaveRef.current = false;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || skipSaveRef.current) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, household, oldHome, newHome, lifestyle, inventoryMode, inventory })
    );
  }, [step, household, oldHome, newHome, lifestyle, inventoryMode, inventory, ready]);

  const setHousehold = useCallback((data: Partial<HouseholdInfo>) => {
    setHouseholdState((prev) => ({ ...prev, ...data }));
  }, []);

  const setOldHome = useCallback((data: Partial<OldHomeInfo>) => {
    setOldHomeState((prev) => ({ ...prev, ...data }));
  }, []);

  const setNewHome = useCallback((data: Partial<NewHomeInfo>) => {
    setNewHomeState((prev) => ({ ...prev, ...data }));
  }, []);

  const setLifestyle = useCallback((data: Partial<LifestyleProfile>) => {
    setLifestyleState((prev) => ({ ...prev, ...data }));
  }, []);

  const setInventoryItem = useCallback((categoryId: string, quantity: number) => {
    const unit = getCategoryById(categoryId)?.unit ?? "件";
    setInventory((prev) => {
      const existing = prev.find((i) => i.categoryId === categoryId);
      if (existing) {
        return prev.map((i) => (i.categoryId === categoryId ? { ...i, quantity } : i));
      }
      return [...prev, { categoryId, quantity, unit }];
    });
  }, []);

  const buildInput = useCallback((): AssessmentInput => {
    let items = inventory;
    const input: AssessmentInput = {
      household,
      oldHome,
      newHome,
      lifestyle,
      inventoryMode,
      inventory: items,
    };
    if (inventoryMode === "quick" || items.length === 0) {
      items = generateQuickInventory(input);
    }
    return { ...input, inventory: items };
  }, [household, oldHome, newHome, lifestyle, inventoryMode, inventory]);

  const computeResult = useCallback(() => calculateAssessment(buildInput()), [buildInput]);

  const result = useMemo(() => {
    if (step !== "result") return null;
    return computeResult();
  }, [step, computeResult]);

  const reset = useCallback(() => {
    setStep("household");
    setHouseholdState(defaultHousehold);
    setOldHomeState(defaultOldHome);
    setNewHomeState(defaultNewHome);
    setLifestyleState(defaultLifestyle);
    setInventoryMode("quick");
    setInventory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        step,
        setStep,
        household,
        setHousehold,
        oldHome,
        setOldHome,
        newHome,
        setNewHome,
        lifestyle,
        setLifestyle,
        inventoryMode,
        setInventoryMode,
        inventory,
        setInventoryItem,
        result,
        computeResult,
        reset,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
