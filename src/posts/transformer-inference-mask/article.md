最近在扣关于Transformer的细节，结果发现了一个问题：众所周知，在训练Transformer的过程中，decode的时候要使用causal mask避免泄漏还未生成的信息。在推理的时候，由于我们是逐个生成token的，所以不会出现泄漏的问题，那么是不是就不需要causal mask了呢？后来我看到StackExchange上有个人和我有相同的问题：[Is the Mask Needed for Masked Self-Attention During Inference with GPT-2](https://ai.stackexchange.com/questions/16516/is-the-mask-needed-for-masked-self-attention-during-inference-with-gpt-2)。目前我对这个问题的理解是这样的：答案是依然需要。

其原因很简单。如果我们只看单层的Transformer，由于在生成的时候只用到最后一个token的输出，所以确实似乎不需要causal mask。但是在多层的Transformer中，每一层的输出都会作为下一层的输入，因此前面几层的每一个token的输出都会被用到。如果我们不使用causal mask，就会导致前面几层的输出会发生未来信息的泄漏，这样就导致推理的过程和训练的过程逻辑不一致，从而会影响模型的性能。

不过这个问题也不需要我们调库的人操心，因为`transformers`库提供的模型类都会自动加上causal mask，不管是在训练还是推理的时候。
