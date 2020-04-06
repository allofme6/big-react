import {
  HostComponent,
  HostText
} from 'shared/ReactWorkTags';
import {
  appendInitialChild,
  createInstance,
  createTextInstance
} from 'reactDOM/ReactHostConfig';


// 执行到当前函数之前已经为每个element创建对应的fiber，并且为每个host fiber创建对应的DOM节点
// 该函数会将fiber的所有子节点（chid,child.sibling...）append到fiber对应的DOM节点上（fiber.stateNode）
// 对于每一级HostComponent，该过程会递归上去，这样就能将分散在各自fiber中的DOM节点形成对应的DOM树
export function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === workInProgress) {
      return;
    }
    while (!node.sibling) {
      if (!node.return || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

// 为 beginWork阶段生成的fiber生成对应DOM，并产生DOM树
export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      const fiberRoot = workInProgress.stateNode;
      console.log('complete host root');
      return null;
    case HostComponent:
      const type = workInProgress.type;
      if (current && workInProgress.stateNode) {
        // current存在代表不是首次render的fiber
      }
      if (!newProps) {
        console.warn('error happen');
        return null;
      }
      // 创建对应DOM节点
      let instance = createInstance(type, newProps);
      // 将子DOM节点append到创建的DOM节点上
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      // TODO 初始化事件？

      return null;
    case HostText:
      // TODO 更新流程
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      return null;
    default:
      break;
  }
}