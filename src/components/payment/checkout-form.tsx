"use client";

import { useState, useEffect } from 'react';
import { useStripeElements } from '~/hooks/use-stripe-elements';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Loader2, CreditCard, Lock } from 'lucide-react';

interface CheckoutFormProps {
  priceId: string;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
}

export function CheckoutForm({ priceId, onSuccess, onError }: CheckoutFormProps) {
  const { stripe, elements, isLoading } = useStripeElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (elements) {
      const cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });

      cardElement.mount('#card-element');

      cardElement.on('change', ({ error }) => {
        if (error) {
          setError(error.message || 'Card error');
        } else {
          setError(null);
        }
      });

      return () => {
        cardElement.destroy();
      };
    }
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement('card')!,
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        return;
      }

      // Create subscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const { subscription, error: serverError } = await response.json();

      if (serverError) {
        setError(serverError);
        return;
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        subscription.client_secret
      );

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
        return;
      }

      onSuccess(subscription.id);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <div id="card-element" className="p-2">
              {/* Stripe Elements will be inserted here */}
            </div>
          </div>
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button
            type="submit"
            disabled={isProcessing || !stripe}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}