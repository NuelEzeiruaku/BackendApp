import Subscription from '../models/subscription.model.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import the Client class from the Upstash Workflow package
const { Client } = require('@upstash/workflow');

// Define your server URL
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5050';

// Initialize the client with your token
const workflowClient = new Client({
  token: process.env.QSTASH_TOKEN
});

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
          ...req.body,
          user: req.user._id,
        });

        // Convert the subscription to a plain object before passing to trigger
        const subscriptionData = subscription.toObject ? subscription.toObject() : JSON.parse(JSON.stringify(subscription));

        // Get the workflowRunId from the trigger
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                // Only pass the ID, not the entire subscription object
                subscriptionId: subscription._id.toString(),
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        // Update the subscription with the workflowId
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            subscription._id, 
            { workflowId: workflowRunId },
            { new: true } // This option returns the updated document
        );

        res.status(201).json({ success: true, data: updatedSubscription });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // check if user is same as the one in the token
      if(req.user.id !== req.params.id) {
        const error = new Error('You are not the owner of this account');
        error.status = 401;
        throw error;
      }

      const subscriptions = await Subscription.find({ user: req.params.id });

      res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
       next(e);
    }
}