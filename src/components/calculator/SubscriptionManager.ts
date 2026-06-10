/**
 * Definición de los distintos niveles de suscripción disponibles.
 */
export type SubscriptionTier = 'free' | '1_month' | '6_months' | '1_year';

/**
 * Interface de Segregación (Interface Segregation Principle):
 * Define el contrato que cualquier manejador de suscripciones debe cumplir.
 */
export interface ISubscriptionManager {
    getSubscription(): SubscriptionTier;
    setSubscription(tier: SubscriptionTier): void;
    cancelSubscription(): void;
    isPremium(): boolean;
}

/**
 * Single Responsibility Principle (Principio de Responsabilidad Única):
 * Esta clase única y exclusivamente administra la persistencia temporal
 * y el acceso a los datos de la suscripción.
 */
export class SubscriptionManager implements ISubscriptionManager {
    private readonly STORAGE_KEY = 'calc_subscription';

    /**
     * Obtiene la suscripción actual desde el LocalStorage.
     * Si no existe, retorna el nivel 'free'.
     */
    public getSubscription(): SubscriptionTier {
        const stored = localStorage.getItem(this.STORAGE_KEY) as SubscriptionTier | null;
        if (stored && ['free', '1_month', '6_months', '1_year'].includes(stored)) {
            return stored;
        }
        return 'free';
    }

    /**
     * Guarda la nueva suscripción en la memoria local persistente.
     */
    public setSubscription(tier: SubscriptionTier): void {
        localStorage.setItem(this.STORAGE_KEY, tier);
    }

    /**
     * Remueve los privilegios devolviendo la cuenta al estado base gratuito.
     */
    public cancelSubscription(): void {
        this.setSubscription('free');
    }

    /**
     * Valida si el usuario tiene permiso para utilizar operadores matemáticos avanzados.
     */
    public isPremium(): boolean {
        return this.getSubscription() !== 'free';
    }
}
