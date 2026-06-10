import type { ISubscriptionManager } from './SubscriptionManager';

export type Operator = '+' | '-' | '*' | '/' | '^' | '√';

/**
 * Interface Principle: Defines what a calculator should do.
 */
export interface IMathEngine {
    evaluate(a: number, b: number | null, operator: Operator): number;
}

/**
 * Open/Closed Principle: La funcionalidad está encapsulada pero puede ser extendida (nuevas operaciones)
 * Dependency Inversion Principle: Dependemos de ISubscriptionManager, no de una implementación concreta.
 */
export class MathEngine implements IMathEngine {
    private subscriptionManager: ISubscriptionManager;

    constructor(subscriptionManager: ISubscriptionManager) {
        this.subscriptionManager = subscriptionManager;
    }

    private assertPremiumAccess(): void {
        if (!this.subscriptionManager.isPremium()) {
             throw new Error('PremiumRequired');
        }
    }

    public evaluate(a: number, b: number | null, operator: Operator): number {
        switch (operator) {
            case '+':
                return a + (b ?? 0);
            case '-':
                return a - (b ?? 0);
            case '*':
                this.assertPremiumAccess();
                return a * (b ?? 1);
            case '/':
                this.assertPremiumAccess();
                if (b === 0) throw new Error('DivideByZero');
                return a / (b ?? 1);
            case '^':
                this.assertPremiumAccess();
                return Math.pow(a, b ?? 1);
            case '√':
                this.assertPremiumAccess();
                if (a < 0) throw new Error('InvalidInput');
                return Math.sqrt(a);
            default:
                throw new Error('UnknownOperator');
        }
    }
}
