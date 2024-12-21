"use client";

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import SnippetDetailPageSkeleton from './_components/SnippetDetailPageSkeleton';

function SnippetDetailPage() {
  const snippetId = useParams().id;

  const snippet = useQuery(api.snippets.getSnippetById, { snippetId : snippetId as Id<"snippets"> });
  
    if (snippet === undefined) {
        return <SnippetDetailPageSkeleton />;
    }


    return (
    <div>SnippetDetailPage</div>
  )
}

export default SnippetDetailPage